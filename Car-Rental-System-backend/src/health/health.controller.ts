import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Liveness probe for the deployment platform.
 *
 * The JWT guard is registered globally, so every route is protected by default.
 * A health check must answer without a token — @Public opens it deliberately.
 */
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
