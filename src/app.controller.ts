import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomRequest } from './app.interface';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  /**
   * Get user data.
   * @returns The authentication result.
   */
  @Get('me')
  async getUserData(@Req() req: CustomRequest): Promise<any> {
    const { user } = req;
    return user;
  }
}
