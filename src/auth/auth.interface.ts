import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

/**
 * Data Transfer Object for user login.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

/**
 * Data Transfer Object for user signup.
 */
export class SignupDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter and one digit',
    },
  )
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

/**
 * Interface representing the response after a successful login.
 */
export interface LoginResponse {
  access_token: string;
}
