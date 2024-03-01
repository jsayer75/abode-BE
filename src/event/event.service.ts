import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RequestUser } from 'src/app.interface';
import { EventDocument, EventModel } from 'src/schemas/event.schema';
import { CreateEventDto, NewEvent } from './event.interface';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

/**
 * Service responsible for handling event-related operations.
 */
@Injectable()
export class EventService {
  /**
   * Constructor for EventService.
   * @param  eventModel - The event model.
   * @param  eventQueue - The event queue.
   */
  constructor(
    @InjectModel(EventModel.name) private eventModel: Model<EventDocument>,
    @InjectQueue('event-notifier') private eventQueue: Queue,
  ) {}

  /**
   * Creates a new event.
   * @param event - The event data.
   * @param  user - The user creating the event.
   * @returns - A promise that resolves to the created event.
   */
  async create(event: CreateEventDto, user: RequestUser): Promise<NewEvent> {
    const eventPayload = {
      name: event.name,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      createdBy: { id: user.id, email: user.email },
      attendees: event.attendees,
    };

    const createdEvent = new this.eventModel(eventPayload);
    const newEvent = await createdEvent.save();

    this.addEventIntoQueue(newEvent);

    return newEvent;
  }

  /**
   * Finds all events of a user.
   * @param  userId - The ID of the user.
   * @returns - A promise that resolves to the events of the user.
   */
  async findAllEventOfUsers(userId: string): Promise<EventDocument[]> {
    return this.eventModel
      .find({
        $or: [{ 'createdBy.id': userId }, { 'attendees.id': userId }],
      })
      .exec();
  }

  /**
   * Finds an event by ID.
   * @param  id - The ID of the event.
   * @returns - A promise that resolves to the found event.
   */
  async findOne(id: string): Promise<EventDocument> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  /**
   * Updates an event.
   * @param  id - The ID of the event to update.
   * @param  event - The updated event data.
   * @returns - A promise that resolves to the updated event.
   */
  async update(id: string, event: Event): Promise<EventDocument> {
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, event, { new: true })
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }

    await this.updateJob(updatedEvent)
    return updatedEvent;
  }

  /**
   * Removes an event.
   * @param  id - The ID of the event to delete.
   * @returns - A promise that resolves when the event is deleted.
   */
  async remove(id: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Event not found');
    }
    this.removeJob(id);
  }

  /**
   * Adds an event into the queue for event notification.
   * @param {NewEvent} event - The event to add to the queue.
   * @returns - A promise that resolves when the event is added to the queue.
   */
  private async addEventIntoQueue(event: NewEvent): Promise<void> {
    const delay = this.getDelayForJob(event.startAt);
    const jobId = event._id.toString();
    await this.eventQueue.add(event, {
      delay,
      removeOnComplete: true,
      jobId,
    });
  }

  /**
   * Gets the delay for a job based on the event's start time.
   * @param time - The start time of the event.
   * @returns - The delay for the job in milliseconds.
   */
  private getDelayForJob(time: string) {
    const startTime = new Date(time);
    const currentTime = new Date();
    return startTime.getTime() - currentTime.getTime() - 3 * 60 * 1000;
  }

  /**
   * Removes a job from the queue by its job ID.
   * @param jobId - The ID of the job to remove.
   * @returns - A promise that resolves when the job is removed.
   */
  async removeJob(jobId: string): Promise<void> {
    const job = await this.eventQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  async updateJob(event: NewEvent): Promise<void> {
    const jobId = event._id.toString();
    await this.removeJob(jobId)
    await this.addEventIntoQueue(event)


  }
}
