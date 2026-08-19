import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { IS_PUBLIC_KEY } from './guards/jwt-auth.guard';

const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an account and sign in' })
  @ApiResponse({
    status: 201,
    description: 'Account created; returns an access token',
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiResponse({ status: 200, description: 'Returns an access token' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get the signed-in user and their profile' })
  @ApiResponse({ status: 200, description: 'The current user' })
  async profile(@Req() req: AuthenticatedRequest) {
    // JwtStrategy attaches { userId, email, role }; the id is the only part trusted
    // here, since the rest of the token could be stale.
    return this.authService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update your own name and phone number' })
  @ApiResponse({ status: 200, description: 'The updated user' })
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.userId, dto);
  }
}
