import type { Request } from 'express';
import type { UserRole } from '../../database/entities/user.entity';

/** What JwtStrategy.validate attaches to the request. */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * A request that has passed the JWT guard.
 *
 * Controllers used `@Req() req: any`, which switched off type checking for every
 * property read off it — including req.user.userId, the value authorisation
 * decisions are made from.
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
