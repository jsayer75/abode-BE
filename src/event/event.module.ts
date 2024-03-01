import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventModel, EventSchema } from 'src/schemas/event.schema';
import { BullModule } from '@nestjs/bull';
import { EventNotifierConsumer } from './event-queue-consumer';

/**
 * Module for handling events.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventModel.name, schema: EventSchema }]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'event-notifier',
    }),
  ],
  providers: [EventService, EventNotifierConsumer],
  controllers: [EventController],
})
export class EventModule {}
