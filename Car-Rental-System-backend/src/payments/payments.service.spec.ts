import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { Payment } from '../database/entities/payment.entity';
import {
  Booking,
  BookingStatus,
  BookingPaymentStatus,
} from '../database/entities/booking.entity';
import { User, UserRole } from '../database/entities/user.entity';
import { PaymentMethod } from './dto/create-payment.dto';
import { PaymentStatus } from './dto/update-payment.dto';

const CUSTOMER_ID = '11111111-1111-1111-1111-111111111111';
const ADMIN_ID = '99999999-9999-9999-9999-999999999999';
const BOOKING_ID = '22222222-2222-2222-2222-222222222222';
const PAYMENT_ID = '33333333-3333-3333-3333-333333333333';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let created: Record<string, unknown> | undefined;
  let bookingUpdates: Record<string, unknown>[];
  let booking: Partial<Booking>;
  let completedSoFar: string;
  let actor: Partial<User> | null;

  beforeEach(async () => {
    created = undefined;
    bookingUpdates = [];
    completedSoFar = '0';
    actor = { id: CUSTOMER_ID, role: UserRole.CUSTOMER };
    booking = {
      id: BOOKING_ID,
      total_price: 750 as never,
      status: BookingStatus.PENDING,
      payment_status: BookingPaymentStatus.PENDING,
      user: { id: CUSTOMER_ID } as User,
    };

    const paymentsRepository = {
      create: jest.fn((data: Record<string, unknown>) => data),
      save: jest.fn(async (data: Record<string, unknown>) => {
        created = data;
        return { id: PAYMENT_ID, ...data };
      }),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(async () => ({ total: completedSoFar })),
      })),
      findOne: jest.fn(async () => ({
        id: PAYMENT_ID,
        amount: 750,
        status: PaymentStatus.PENDING,
        booking: { ...booking, user: { id: CUSTOMER_ID } },
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(Payment), useValue: paymentsRepository },
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            findOne: jest.fn(async () => booking),
            update: jest.fn(
              async (id: string, data: Record<string, unknown>) => {
                bookingUpdates.push({ id, ...data });
              },
            ),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn(async () => actor) },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    // findOne is used by update(); stub it so the test targets the authorisation.
    jest.spyOn(service, 'findOne').mockResolvedValue({
      id: PAYMENT_ID,
      amount: 750,
      status: PaymentStatus.PENDING,
      booking: { ...booking, user: { id: CUSTOMER_ID } },
    } as never);
  });

  describe('create', () => {
    it('charges what the booking says, not what the request says', async () => {
      await service.create(
        {
          booking_id: BOOKING_ID,
          payment_method: PaymentMethod.CREDIT_CARD,
          // The DTO drops this, and the service never reads one.
          amount: 1,
        } as never,
        CUSTOMER_ID,
      );

      expect(created?.amount).toBe(750);
    });

    it('charges only the outstanding balance', async () => {
      completedSoFar = '500';

      await service.create(
        { booking_id: BOOKING_ID, payment_method: PaymentMethod.CREDIT_CARD },
        CUSTOMER_ID,
      );

      expect(created?.amount).toBe(250);
    });

    it('starts every payment pending, never completed', async () => {
      await service.create(
        { booking_id: BOOKING_ID, payment_method: PaymentMethod.CREDIT_CARD },
        CUSTOMER_ID,
      );

      expect(created?.status).toBe(PaymentStatus.PENDING);
    });

    it('does not mark the booking paid just because a payment was created', async () => {
      await service.create(
        { booking_id: BOOKING_ID, payment_method: PaymentMethod.CREDIT_CARD },
        CUSTOMER_ID,
      );

      expect(bookingUpdates).toHaveLength(0);
    });

    it('refuses payment on a fully paid booking', async () => {
      completedSoFar = '750';

      await expect(
        service.create(
          { booking_id: BOOKING_ID, payment_method: PaymentMethod.CREDIT_CARD },
          CUSTOMER_ID,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('refuses payment on a cancelled booking', async () => {
      booking = { ...booking, status: BookingStatus.CANCELLED };

      await expect(
        service.create(
          { booking_id: BOOKING_ID, payment_method: PaymentMethod.CREDIT_CARD },
          CUSTOMER_ID,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("refuses to pay someone else's booking", async () => {
      booking = { ...booking, user: { id: 'someone-else' } as User };

      await expect(
        service.create(
          { booking_id: BOOKING_ID, payment_method: PaymentMethod.CREDIT_CARD },
          CUSTOMER_ID,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('update', () => {
    it('stops a customer marking their own payment completed', async () => {
      // This was the hole: the booking's owner could PATCH the payment to
      // 'completed' and have the booking marked paid without paying.
      await expect(
        service.update(
          PAYMENT_ID,
          { status: PaymentStatus.COMPLETED },
          CUSTOMER_ID,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(bookingUpdates).toHaveLength(0);
    });

    it('lets an admin complete a payment and settles the booking', async () => {
      actor = { id: ADMIN_ID, role: UserRole.ADMIN };
      completedSoFar = '750';

      await service.update(
        PAYMENT_ID,
        { status: PaymentStatus.COMPLETED },
        ADMIN_ID,
      );

      expect(bookingUpdates[0]).toMatchObject({
        id: BOOKING_ID,
        payment_status: BookingPaymentStatus.PAID,
      });
    });

    it('puts a booking back to unpaid when its payments no longer cover it', async () => {
      actor = { id: ADMIN_ID, role: UserRole.ADMIN };
      completedSoFar = '0';

      await service.update(
        PAYMENT_ID,
        { status: PaymentStatus.REFUNDED },
        ADMIN_ID,
      );

      expect(bookingUpdates[0]).toMatchObject({
        payment_status: BookingPaymentStatus.PENDING,
      });
    });
  });
});
