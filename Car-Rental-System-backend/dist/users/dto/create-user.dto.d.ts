import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role?: UserRole;
    phoneNumber?: string;
}
