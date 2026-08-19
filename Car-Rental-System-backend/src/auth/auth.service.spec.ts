import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { User, UserRole } from '../database/entities/user.entity';
import { Profile } from '../database/entities/profile.entity';

const USER_ID = '4320e764-96e4-41f1-a5af-0d72af81c31b';
const PASSWORD = 'Password123!';

describe('AuthService', () => {
  let service: AuthService;
  let existingUser: Partial<User> | null;
  let saved: Record<string, unknown>[];
  let updates: Record<string, unknown>[];

  beforeEach(async () => {
    existingUser = null;
    saved = [];
    updates = [];

    const manager = {
      create: jest.fn((_entity: unknown, data?: Record<string, unknown>) => data ?? {}),
      save: jest.fn(async (data: Record<string, unknown>) => {
        saved.push(data);
        return { id: USER_ID, ...data };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: { sign: jest.fn(() => 'signed.jwt.token') } },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(async (work: (m: unknown) => Promise<unknown>) => work(manager)),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(async () => existingUser),
            update: jest.fn(async (id: string, data: Record<string, unknown>) => {
              updates.push({ id, ...data });
            }),
          },
        },
        { provide: getRepositoryToken(Profile), useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('stores a bcrypt hash, never the password itself', async () => {
      await service.register({ email: 'nour@example.com', password: PASSWORD });

      const userRow = saved[0] as { password_hash: string };
      expect(userRow.password_hash).not.toBe(PASSWORD);
      expect(userRow.password_hash).toMatch(/^\$2[aby]\$\d{2}\$/);
      await expect(bcrypt.compare(PASSWORD, userRow.password_hash)).resolves.toBe(true);
    });

    it('always creates a customer, whatever the caller asks for', async () => {
      // The DTO has no role field, so this cannot arrive through the API at all —
      // this pins the service behaviour if someone adds one later.
      await service.register({
        email: 'hacker@example.com',
        password: PASSWORD,
        role: UserRole.ADMIN,
      } as never);

      expect((saved[0] as { role: UserRole }).role).toBe(UserRole.CUSTOMER);
    });

    it('normalises the email so Nour@Example.com and nour@example.com are one account', async () => {
      await service.register({ email: '  Nour@Example.COM  ', password: PASSWORD });

      expect((saved[0] as { email: string }).email).toBe('nour@example.com');
    });

    it('creates the profile alongside the user', async () => {
      await service.register({
        email: 'nour@example.com',
        password: PASSWORD,
        first_name: 'Nour',
        last_name: 'Hassan',
      });

      expect(saved).toHaveLength(2);
      expect(saved[1]).toMatchObject({ first_name: 'Nour', last_name: 'Hassan', user_id: USER_ID });
    });

    it('refuses an email that is already registered', async () => {
      existingUser = { id: USER_ID, email: 'nour@example.com' };

      await expect(
        service.register({ email: 'nour@example.com', password: PASSWORD }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      existingUser = {
        id: USER_ID,
        email: 'nour@example.com',
        role: UserRole.CUSTOMER,
        is_active: true,
        password_hash: await bcrypt.hash(PASSWORD, 12),
      };
    });

    it('returns a token carrying the real user id', async () => {
      const result = await service.login({ email: 'nour@example.com', password: PASSWORD });

      // The old implementation signed sub: 'mock-user-id', which is not a UUID and
      // blew up every query that used it as a foreign key.
      expect(result.user.id).toBe(USER_ID);
      expect(result.access_token).toBe('signed.jwt.token');
    });

    it('records the sign-in time', async () => {
      await service.login({ email: 'nour@example.com', password: PASSWORD });

      expect(updates[0]).toMatchObject({ id: USER_ID });
      expect(updates[0].last_login).toBeInstanceOf(Date);
    });

    it('rejects a wrong password', async () => {
      await expect(
        service.login({ email: 'nour@example.com', password: 'wrong' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects a deactivated account even with the right password', async () => {
      existingUser = { ...existingUser, is_active: false };

      await expect(
        service.login({ email: 'nour@example.com', password: PASSWORD }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('gives the same message for an unknown email as for a wrong password', async () => {
      const wrongPassword = await service
        .login({ email: 'nour@example.com', password: 'wrong' })
        .catch((error: Error) => error.message);

      existingUser = null;
      const unknownEmail = await service
        .login({ email: 'nobody@example.com', password: PASSWORD })
        .catch((error: Error) => error.message);

      // Different messages would let anyone check which emails have accounts.
      expect(unknownEmail).toBe(wrongPassword);
    });

    it('spends time hashing even when the account does not exist', async () => {
      existingUser = null;
      const start = Date.now();
      await service.login({ email: 'nobody@example.com', password: PASSWORD }).catch(() => null);

      // A bare early return would come back in well under a millisecond and make
      // registered emails identifiable by response time alone.
      expect(Date.now() - start).toBeGreaterThan(5);
    });
  });
});
