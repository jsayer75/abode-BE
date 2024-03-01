import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Attendee } from 'src/event/event.interface';

/**
 * Interface representing an event document.
 */
export type EventDocument = EventModel & Document;

/**
 * Schema for the event model.
 */
@Schema()
export class EventModel {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  startAt: string;

  @Prop({ required: true })
  endAt: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: { id: string; email: string };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  attendees: Attendee[];
}

/**
 * Factory function for creating the event schema.
 */
export const EventSchema = SchemaFactory.createForClass(EventModel);
