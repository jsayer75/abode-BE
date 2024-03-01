import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from 'src/app.interface';

/**
 * Middleware for handling authentication.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  /**
   * Constructor for AuthMiddleware.
   * @param jwtService - The JWT service.
   */
  constructor(private jwtService: JwtService) {}

  /**
   * Middleware function for handling authentication.
   * @param  req - The request object.
   * @param  res - The response object.
   * @param  next - The next function.
   */
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = { id: decoded.id, email: decoded.email };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
