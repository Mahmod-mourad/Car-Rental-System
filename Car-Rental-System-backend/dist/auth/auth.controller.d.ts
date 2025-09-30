import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(authDto: AuthDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string | undefined;
            role: string | undefined;
        };
    }>;
    register(authDto: AuthDto): Promise<{
        message: string;
        userId: string;
    }>;
    profile(req: any): Promise<{
        id: any;
        email: any;
        role: any;
    }>;
}
