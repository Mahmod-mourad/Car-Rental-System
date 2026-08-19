import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../guards/jwt-auth.guard';

/**
 * Marks a route as reachable without a token.
 *
 * The JWT guard is registered globally, so everything is protected by default and
 * opening a route is a deliberate act you can grep for.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
