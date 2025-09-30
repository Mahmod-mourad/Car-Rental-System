import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../entities/user.entity';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role?: UserRole;
}
export {};
