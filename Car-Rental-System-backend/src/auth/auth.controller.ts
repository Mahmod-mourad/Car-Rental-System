import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SetMetadata, Req } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../auth/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User sign in' })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @SetMetadata(IS_PUBLIC_KEY, true)
  async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User sign up' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @SetMetadata(IS_PUBLIC_KEY, true)
  async signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  // Friendly aliases expected by frontend
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SetMetadata(IS_PUBLIC_KEY, true)
  async login(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @SetMetadata(IS_PUBLIC_KEY, true)
  async register(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user data' })
  async profile(@Req() req: any) {
    // JwtStrategy attaches { userId, email, role }
    return { id: req.user.userId, email: req.user.email, role: req.user.role };
  }
}
