import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(req: Request, payload: any): Promise<{
        userId: any;
        email: any;
        role: any;
    }>;
}
export {};
