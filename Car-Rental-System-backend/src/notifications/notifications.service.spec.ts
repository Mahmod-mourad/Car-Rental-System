import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { Notification, NotificationType } from '../database/entities/notification.entity';

const USER_ID = '11111111-1111-1111-1111-111111111111';
const OTHER_USER_ID = '22222222-2222-2222-2222-222222222222';
const NOTIFICATION_ID = '33333333-3333-3333-3333-333333333333';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: {
    create: jest.Mock;
    save: jest.Mock;
    findAndCount: jest.Mock;
    findOne: jest.Mock;
    count: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn((data) => data),
      save: jest.fn(async (data) => ({ id: NOTIFICATION_ID, ...data })),
      findAndCount: jest.fn(async () => [[], 0]),
      findOne: jest.fn(async () => null),
      count: jest.fn(async () => 0),
      update: jest.fn(async () => ({ affected: 3 })),
      delete: jest.fn(async () => ({ affected: 1 })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useValue: repository },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('creates notifications unread', async () => {
    await service.create({
      userId: USER_ID,
      type: NotificationType.BOOKING_CREATED,
      title: 'Booking requested',
      body: 'Awaiting confirmation.',
    });

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ read: false }));
  });

  it('writes through the transaction manager when one is given', async () => {
    const managerRepository = { ...repository, create: jest.fn((d) => d), save: jest.fn(async (d) => d) };
    const manager = { getRepository: jest.fn(() => managerRepository) } as never;

    await service.create(
      {
        userId: USER_ID,
        type: NotificationType.BOOKING_CREATED,
        title: 'Booking requested',
        body: 'Awaiting confirmation.',
      },
      manager,
    );

    // The default repository would commit on its own and survive a rollback of the
    // work that triggered it.
    expect(managerRepository.save).toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('only ever reads one user\'s notifications', async () => {
    await service.findForUser(USER_ID);

    expect(repository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ where: { user_id: USER_ID } }),
    );
  });

  it('returns newest first', async () => {
    await service.findForUser(USER_ID);

    expect(repository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ order: { created_at: 'DESC' } }),
    );
  });

  it('scopes mark-as-read to the owner, not just the id', async () => {
    repository.findOne.mockResolvedValueOnce({ id: NOTIFICATION_ID, user_id: USER_ID, read: false });

    await service.markAsRead(NOTIFICATION_ID, USER_ID);

    // Looking up by id alone would let anyone mark someone else's notification read
    // by guessing a uuid.
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: NOTIFICATION_ID, user_id: USER_ID },
    });
  });

  it('refuses to mark another user\'s notification as read', async () => {
    repository.findOne.mockResolvedValueOnce(null);

    await expect(service.markAsRead(NOTIFICATION_ID, OTHER_USER_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('marks only the caller\'s unread notifications', async () => {
    const result = await service.markAllAsRead(USER_ID);

    expect(repository.update).toHaveBeenCalledWith(
      { user_id: USER_ID, read: false },
      { read: true },
    );
    expect(result).toEqual({ updated: 3 });
  });

  it('refuses to delete a notification belonging to someone else', async () => {
    repository.delete.mockResolvedValueOnce({ affected: 0 });

    await expect(service.remove(NOTIFICATION_ID, OTHER_USER_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
