import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Interface representing a user document.
 */
export type UserDocument = UserModel & Document;

/**
 * Schema for the user model.
 */
@Schema()
export class UserModel {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;
}

/**
 * Factory function for creating the user schema.
 */
export const UserSchema = SchemaFactory.createForClass(UserModel);
