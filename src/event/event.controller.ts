import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CustomRequest } from 'src/app.interface';
import { CreateEventDto } from './event.interface';

/**
 * Controller for handling event-related requests.
 */
@Controller('event')
export class EventController {
  /**
   * Constructor for EventController.
   * @param  eventService - The event service.
   */
  constructor(private readonly eventService: EventService) {}

  /**
   * Creates a new event.
   * @param  req - The request object.
   * @param {event - The event data.
   * @returns - A promise that resolves to the created event.
   */
  @Post()
  async create(@Req() req: CustomRequest, @Body() event: CreateEventDto) {
    const { user } = req;
    return this.eventService.create(event, user);
  }

  /**
   * Finds all events of a user.
   * @param  req - The request object.
   * @returns - A promise that resolves to the events of the user.
   */
  @Get()
  async findAllEventOfUsers(@Req() req: CustomRequest) {
    const {
      user: { id },
    } = req;
    return this.eventService.findAllEventOfUsers(id);
  }

  /**
   * Finds an event by ID.
   * @param {string} id - The ID of the event.
   * @returns - A promise that resolves to the found event.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  /**
   * Updates an event.
   * @param {string} id - The ID of the event to update.
   * @param {any} event - The updated event data.
   * @returns - A promise that resolves to the updated event.
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() event: any) {
    return this.eventService.update(id, event);
  }

  /**
   * Deletes an event.
   * @param {string} id - The ID of the event to delete.
   * @returns {Promise<void>} - A promise that resolves when the event is deleted.
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventService.remove(id);
  }
}
