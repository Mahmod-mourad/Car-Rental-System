import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient | null;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseKey = this.configService.get<string>('supabase.key');
    
    // Allow backend to start without Supabase for local development
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      console.warn('Supabase not configured - running in local development mode');
      this.supabase = null;
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async signIn(authDto: AuthDto) {
    const { email, password } = authDto;
    
    // For local development without Supabase
    if (!this.supabase) {
      // Simple mock authentication for development
      if (email === 'admin@example.com' && password === 'admin123') {
        const payload = { 
          sub: 'mock-user-id', 
          email: email,
          role: 'admin'
        };

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            id: 'mock-user-id',
            email: email,
            role: 'admin',
          },
        };
      } else if (email === 'user@example.com' && password === 'user123') {
        const payload = { 
          sub: 'mock-user-id-2', 
          email: email,
          role: 'user'
        };

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            id: 'mock-user-id-2',
            email: email,
            role: 'user',
          },
        };
      } else {
        throw new UnauthorizedException('Invalid credentials. Use admin@example.com/admin123 or user@example.com/user123');
      }
    }
    
    const { data: { user, session }, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !user) {
      throw new UnauthorizedException(error?.message || 'Invalid credentials');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role || 'user' // Default role if not provided
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async signUp(authDto: AuthDto) {
    const { email, password } = authDto;

    // For local development without Supabase
    if (!this.supabase) {
      return { 
        message: 'User registration disabled in development mode. Use existing test accounts.', 
        userId: 'mock-user-id' 
      };
    }

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException(error?.message || 'Failed to create user');
    }

    return { 
      message: 'User created successfully', 
      userId: data.user.id 
    };
  }
}
