import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserModel } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { BullModule } from '@nestjs/bull';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

/**
 * Main application module.
 */
@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true,

      }
    ),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    AuthModule,
    EventModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UserService],
})
export class AppModule implements NestModule {
  /**
   * Configures the middleware for this module.
   * @param consumer - The middleware consumer.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth/(.*)').forRoutes('*'); // Apply middleware to all other routes
  }
}
