import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Notification, NotificationType } from '../database/entities/notification.entity';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  referenceId?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  /**
   * Records a notification. Pass the transaction's `manager` when the notification
   * belongs to the same unit of work as whatever caused it — a booking and its
   * "booking created" notice should either both land or neither.
   */
  async create(input: CreateNotificationInput, manager?: EntityManager): Promise<Notification> {
    const repository = manager ? manager.getRepository(Notification) : this.notificationsRepository;

    return repository.save(
      repository.create({
        user_id: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        reference_id: input.referenceId ?? null,
        read: false,
      }),
    );
  }

  async findForUser(
    userId: string,
    options: { unreadOnly?: boolean; page?: number; limit?: number } = {},
  ): Promise<{ data: Notification[]; total: number; unread: number }> {
    const { unreadOnly = false, page = 1, limit = 20 } = options;

    const where = unreadOnly ? { user_id: userId, read: false } : { user_id: userId };

    const [data, total] = await this.notificationsRepository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const unread = await this.notificationsRepository.count({
      where: { user_id: userId, read: false },
    });

    return { data, total, unread };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    // Scoped by user_id as well as id, so one person cannot mark another's
    // notification as read by guessing its id.
    const notification = await this.notificationsRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.notificationsRepository.update(
      { user_id: userId, read: false },
      { read: true },
    );

    return { updated: result.affected ?? 0 };
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.notificationsRepository.delete({ id, user_id: userId });

    if (!result.affected) {
      throw new NotFoundException('Notification not found');
    }
  }
}
