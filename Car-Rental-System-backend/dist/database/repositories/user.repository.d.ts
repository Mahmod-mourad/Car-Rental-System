import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { BaseRepository } from './base.repository';
export declare class UserRepository extends BaseRepository<User> {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findUsersByRole(role: UserRole): Promise<User[]>;
    updateLastLogin(userId: string): Promise<void>;
    findUsersWithProfile(): Promise<User[]>;
}
