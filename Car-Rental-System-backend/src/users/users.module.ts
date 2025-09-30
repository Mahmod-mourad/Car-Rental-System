import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../database/entities/user.entity';
import { UserRepository } from '../database/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
  ],
  exports: [
    UsersService,
    TypeOrmModule,
  ],
})
export class UsersModule {}
