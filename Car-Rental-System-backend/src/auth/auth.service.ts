import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../database/entities/user.entity';
import { Profile } from '../database/entities/profile.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Cost factor for bcrypt. 12 is the usual starting point: slow enough to make
 * offline cracking expensive, fast enough that a login stays well under 100ms.
 */
const BCRYPT_ROUNDS = 12;

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  access_token: string;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with that email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // The user row and its profile are written together — a user without a profile
    // would break every endpoint that loads the `profile` relation.
    const user = await this.dataSource.transaction(async (manager) => {
      const created = await manager.save(
        manager.create(User, {
          email,
          password_hash: passwordHash,
          // Roles are never taken from the request body. Anyone self-registering is a
          // customer; elevating an account is an admin-only operation on /users.
          role: UserRole.CUSTOMER,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      );

      const profile = manager.create(Profile);
      profile.user_id = created.id;
      profile.first_name = dto.first_name ?? null;
      profile.last_name = dto.last_name ?? null;
      profile.phone = dto.phone ?? null;
      await manager.save(profile);

      return created;
    });

    return this.issueToken(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const email = dto.email.trim().toLowerCase();

    // password_hash is `select: false` on the entity, so it has to be asked for.
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'role', 'is_active', 'password_hash'],
    });

    // Hash against a dummy value when the account does not exist. Skipping the
    // comparison would make "no such user" measurably faster than "wrong password"
    // and let someone enumerate registered emails by timing the responses.
    const hashToCheck = user?.password_hash ?? (await this.dummyHash());
    const passwordMatches = await bcrypt.compare(dto.password, hashToCheck);

    if (!user || !passwordMatches) {
      // One message for both cases, on purpose.
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('This account has been deactivated');
    }

    await this.usersRepository.update(user.id, { last_login: new Date() });

    return this.issueToken(user);
  }

  private dummyHashCache?: string;

  private async dummyHash(): Promise<string> {
    if (this.dummyHashCache === undefined) {
      this.dummyHashCache = await bcrypt.hash('no-such-user', BCRYPT_ROUNDS);
    }
    return this.dummyHashCache as string;
  }

  private issueToken(user: User): AuthResult {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
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
}
