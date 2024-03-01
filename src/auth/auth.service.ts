import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { LoginDto, LoginResponse, SignupDto } from './auth.interface';
import { User } from 'src/user/user.interface';

/**
 * Service responsible for handling authentication-related operations.
 */
@Injectable()
export class AuthService {
  /**
   * Constructor for AuthService.
   * @param userService - The user service.
   * @param jwtService - The JWT service.
   */
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a password against a hashed password.
   * @param password - The password to validate.
   * @param  userPassword - The hashed password to compare against.
   * @returns - A promise that resolves to true if the passwords match, otherwise false.
   */
  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  /**
   * Validates a user's credentials.
   * @param  email - The user's email.
   * @param  password - The user's password.
   * @returns - A promise that resolves to the user if the credentials are valid, otherwise null.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    if (await this.validatePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  /**
   * Gets user data.
   * @returns - A promise that resolves to user data.
   */
  async getUserData(): Promise<string> {
    return 'sss';
  }

  /**
   * Logs in a user.
   * @param loginDto - The login data.
   * @returns - A promise that resolves to an object containing the access token.
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = { email: user.email, id: user._id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1y' });
    return {
      access_token: accessToken,
    };
  }

  /**
   * Signs up a new user.
   * @param signupDto - The signup data.
   * @returns - A promise that resolves to an object containing the access token.
   */
  async signup(signupDto: SignupDto): Promise<LoginResponse> {
    const { email, password } = signupDto;

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      await this.userService.createUser(email, hashedPassword);

      return this.login({ email, password });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
