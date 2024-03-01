import { Types, Document } from 'mongoose';
import { UserDocument, UserModel } from 'src/schemas/user.schema';

/**
 * Type representing a user.
 */
export type User = Document<unknown, {}, UserDocument> &
  UserModel &
  Document<any, any, any> & {
    _id: Types.ObjectId;
  };
