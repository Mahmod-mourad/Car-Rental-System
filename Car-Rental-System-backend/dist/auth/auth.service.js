"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let AuthService = class AuthService {
    jwtService;
    configService;
    supabase;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        const supabaseUrl = this.configService.get('supabase.url');
        const supabaseKey = this.configService.get('supabase.key');
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
            console.warn('Supabase not configured - running in local development mode');
            this.supabase = null;
        }
        else {
            this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        }
    }
    async signIn(authDto) {
        const { email, password } = authDto;
        if (!this.supabase) {
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
            }
            else if (email === 'user@example.com' && password === 'user123') {
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
            }
            else {
                throw new common_1.UnauthorizedException('Invalid credentials. Use admin@example.com/admin123 or user@example.com/user123');
            }
        }
        const { data: { user, session }, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error || !user) {
            throw new common_1.UnauthorizedException(error?.message || 'Invalid credentials');
        }
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role || 'user'
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
    async signUp(authDto) {
        const { email, password } = authDto;
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
            throw new common_1.UnauthorizedException(error?.message || 'Failed to create user');
        }
        return {
            message: 'User created successfully',
            userId: data.user.id
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map