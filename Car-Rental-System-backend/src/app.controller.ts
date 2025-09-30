import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SetMetadata(IS_PUBLIC_KEY, true)
  getHello(): string {
    return this.appService.getHello();
  }
}
