import { Request } from 'express';

/**
 * Custom request type that extends the Express request type with user information.
 */
export type CustomRequest = Request & { user?: RequestUser };

/**
 * Interface representing a user in a request.
 */
export interface RequestUser {
  id: string;
  email: string;
}
