import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponse, SignupDto } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Log in a user.
   * @param loginDto - The login data.
   * @returns The authentication result.
   */
  @Post('login')
  async login(@Body() loginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * Sign up a new user.
   * @param {SignupDto} signupDto - The signup data.
   * @returns The authentication result.
   */
  @Post('signup')
  async signup(@Body() signupDto): Promise<LoginResponse> {
    return this.authService.signup(signupDto);
  }
}
