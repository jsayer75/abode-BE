import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserModel } from 'src/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';

/**
 * Module for handling user-related functionality.
 */
@Module({
  controllers: [UserController],
  imports: [
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1y' },
    }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  providers: [UserService, AuthService],
})
export class UserModule {}
