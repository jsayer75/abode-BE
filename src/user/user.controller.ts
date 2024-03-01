import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Attendee } from 'src/event/event.interface';

/**
 * Controller for handling user-related requests.
 */
@Controller('user')
export class UserController {
  /**
   * Constructor for UserController.
   * @param  userService - The user service.
   */
  constructor(private userService: UserService) {}

  /**
   * Retrieves user data.
   * @param search - The search query.
   * @returns - A promise that resolves to the user data.
   */
  @Get('attendees')
  async getUserData(@Query('search') search: string) {
    return this.userService.getAttendees(search);
  }

}
