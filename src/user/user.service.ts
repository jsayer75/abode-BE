import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModel } from '../schemas/user.schema';
import { User } from './user.interface';

/**
 * Service responsible for handling user-related operations.
 */
@Injectable()
export class UserService {
  /**
   * Constructor for UserService.
   * @param  userModel - The user model.
   */
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Finds a user by email.
   * @param  email - The email address of the user.
   * @returns - A promise that resolves to the found user.
   */
  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Creates a new user.
   * @param  email - The email address of the user.
   * @param  password - The password of the user.
   * @returns - A promise that resolves to the created user.
   */
  async createUser(email: string, password: string): Promise<User> {
    const newUser = new this.userModel({ email, password });
    return newUser.save();
  }

  /**
   * Retrieves attendees based on a search query.
   * @param  search - The search query.
   * @returns - A promise that resolves to the attendees.
   */
  async getAttendees(search: string): Promise<User[]> {
    return this.userModel.aggregate([
      { $match: { email: { $regex: search, $options: 'i' } } },
      {
        $project: {
          id: '$_id',
          email: 1,
          _id: 0,
        },
      },
    ]);
  }
}
