import {
  IsString,
  IsNotEmpty,
  IsISO8601,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Types, Document } from 'mongoose';
import { EventDocument, EventModel } from 'src/schemas/event.schema';

/**
 * Data Transfer Object for creating an event.
 */
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  startAt: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  endAt: string;

  @IsArray()
  attendees: Attendee[];
}

/**
 * Interface representing an attendee of an event.
 */
export interface Attendee {
  id: string;
  email: string;
}

/**
 * Type representing a new event.
 */
export type NewEvent = Document<unknown, {}, EventDocument> &
  EventModel &
  Document<any, any, any> & {
    _id: Types.ObjectId;
  };
