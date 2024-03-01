import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';
import { NewEvent } from './event.interface';

/**
 * Consumer for processing events and sending notifications.
 */
@Processor('event-notifier')
export class EventNotifierConsumer {
  /**
   * Process method for handling jobs in the queue.
   * @param job - The job to process.
   */
  @Process()
  async transcode(job: Job<NewEvent>) {
    const event = job.data;
    const isOrganizerInTheAttendees = event.attendees.some(
      (attendee) => attendee.id === event.createdBy.id,
    );
    if (!isOrganizerInTheAttendees) {
      console.log(
        `sending email to ${event.createdBy.id}/${event.createdBy.email} `,
      );
    }

    event.attendees.forEach((attendee) => {
      console.log(`sending email to ${attendee.id}/${attendee.email} `);
    });
  }
}
