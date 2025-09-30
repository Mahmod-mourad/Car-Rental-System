import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      relations: ['profile'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
  }

  async findUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({ 
      where: { role },
      relations: ['profile'],
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { last_login: new Date() });
  }

  async findUsersWithProfile(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['profile'],
    });
  }

  // Add more user-specific methods here
}
