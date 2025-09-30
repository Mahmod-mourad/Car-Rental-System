import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private supabase;
    constructor(jwtService: JwtService, configService: ConfigService);
    signIn(authDto: AuthDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string | undefined;
            role: string | undefined;
        };
    }>;
    signUp(authDto: AuthDto): Promise<{
        message: string;
        userId: string;
    }>;
}
