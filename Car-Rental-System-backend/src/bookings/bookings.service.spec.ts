import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { BookingsService } from './bookings.service';
import {
  Booking,
  BookingPaymentStatus,
  BookingStatus,
} from '../database/entities/booking.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../database/entities/notification.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { User } from '../database/entities/user.entity';

const USER_ID = '11111111-1111-1111-1111-111111111111';
const VEHICLE_ID = '22222222-2222-2222-2222-222222222222';

/** A date `days` from today, as the ISO date string the API accepts. */
function daysFromNow(days: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

describe('BookingsService.create', () => {
  let service: BookingsService;
  let savedBooking: Partial<Booking> | undefined;
  let conflictToReturn: Partial<Booking> | null;
  let vehicleToReturn: Partial<Vehicle> | null;
  let lockUsed: unknown;
  let notificationsCreated: {
    input: Record<string, unknown>;
    manager: unknown;
  }[];

  beforeEach(async () => {
    savedBooking = undefined;
    conflictToReturn = null;
    lockUsed = undefined;
    notificationsCreated = [];
    vehicleToReturn = {
      id: VEHICLE_ID,
      price_per_day: 250,
      available: true,
    } as Partial<Vehicle>;

    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(async () => conflictToReturn),
    };

    const manager = {
      findOne: jest.fn(
        async (_entity: unknown, options: { lock?: unknown }) => {
          lockUsed = options.lock;
          return vehicleToReturn;
        },
      ),
      createQueryBuilder: jest.fn(() => queryBuilder),
      create: jest.fn((_entity: unknown, data: Partial<Booking>) => data),
      save: jest.fn(async (_entity: unknown, data: Partial<Booking>) => {
        savedBooking = data;
        return { ...data, id: 'booking-1' };
      }),
      findOneOrFail: jest.fn(async () => ({
        ...savedBooking,
        id: 'booking-1',
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: {} },
        { provide: getRepositoryToken(Vehicle), useValue: {} },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn(async () => ({ id: USER_ID })) },
        },
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn(
              async (
                input: Record<string, unknown>,
                passedManager: unknown,
              ) => {
                notificationsCreated.push({ input, manager: passedManager });
                return {};
              },
            ),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(
              async (work: (m: unknown) => Promise<unknown>) => work(manager),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  describe('pricing', () => {
    it('prices the booking from the stored daily rate, not from the request', async () => {
      await service.create(
        {
          vehicle_id: VEHICLE_ID,
          start_date: daysFromNow(1),
          end_date: daysFromNow(4),
          // A caller cannot smuggle a price in — the DTO drops unknown properties and
          // the service never reads one.
          total_price: 0,
        } as never,
        USER_ID,
      );

      // 3 days at 250 a day.
      expect(savedBooking?.total_price).toBe(750);
    });

    it('charges at least one day for a same-length rental', async () => {
      await service.create(
        {
          vehicle_id: VEHICLE_ID,
          start_date: daysFromNow(2),
          end_date: daysFromNow(3),
        },
        USER_ID,
      );

      expect(savedBooking?.total_price).toBe(250);
    });

    it('starts a booking unpaid and pending', async () => {
      await service.create(
        {
          vehicle_id: VEHICLE_ID,
          start_date: daysFromNow(1),
          end_date: daysFromNow(2),
        },
        USER_ID,
      );

      expect(savedBooking?.status).toBe(BookingStatus.PENDING);
      expect(savedBooking?.payment_status).toBe(BookingPaymentStatus.PENDING);
    });
  });

  describe('date validation', () => {
    it('rejects an end date on or before the start date', async () => {
      await expect(
        service.create(
          {
            vehicle_id: VEHICLE_ID,
            start_date: daysFromNow(5),
            end_date: daysFromNow(5),
          },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      await expect(
        service.create(
          {
            vehicle_id: VEHICLE_ID,
            start_date: daysFromNow(5),
            end_date: daysFromNow(2),
          },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects a start date in the past', async () => {
      await expect(
        service.create(
          {
            vehicle_id: VEHICLE_ID,
            start_date: daysFromNow(-1),
            end_date: daysFromNow(3),
          },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('availability', () => {
    it('locks the vehicle row before checking for conflicts', async () => {
      await service.create(
        {
          vehicle_id: VEHICLE_ID,
          start_date: daysFromNow(1),
          end_date: daysFromNow(2),
        },
        USER_ID,
      );

      // Without the row lock, two concurrent requests can both pass the overlap
      // check before either has inserted, and the vehicle gets double-booked.
      expect(lockUsed).toEqual({ mode: 'pessimistic_write' });
    });

    it('refuses dates that overlap an existing booking', async () => {
      conflictToReturn = { id: 'existing-booking' };

      await expect(
        service.create(
          {
            vehicle_id: VEHICLE_ID,
            start_date: daysFromNow(1),
            end_date: daysFromNow(4),
          },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('refuses a vehicle that is marked unavailable', async () => {
      vehicleToReturn = {
        id: VEHICLE_ID,
        price_per_day: 250,
        available: false,
      } as Partial<Vehicle>;

      await expect(
        service.create(
          {
            vehicle_id: VEHICLE_ID,
            start_date: daysFromNow(1),
            end_date: daysFromNow(2),
          },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('records a notification inside the booking transaction', async () => {
      await service.create(
        {
          vehicle_id: VEHICLE_ID,
          start_date: daysFromNow(1),
          end_date: daysFromNow(2),
        },
        USER_ID,
      );

      expect(notificationsCreated).toHaveLength(1);
      expect(notificationsCreated[0].input).toMatchObject({
        userId: USER_ID,
        type: NotificationType.BOOKING_CREATED,
      });
      // Passing the transaction manager is what keeps a rolled-back booking from
      // leaving behind a notification saying it worked.
      expect(notificationsCreated[0].manager).toBeDefined();
    });

    it('records no notification when the booking is rejected', async () => {
      conflictToReturn = { id: 'existing-booking' };

      await service
        .create(
          {
            vehicle_id: VEHICLE_ID,
            start_date: daysFromNow(1),
            end_date: daysFromNow(4),
          },
          USER_ID,
        )
        .catch(() => null);

      expect(notificationsCreated).toHaveLength(0);
    });

    it('reports a missing vehicle as not found', async () => {
      vehicleToReturn = null;

      await expect(
        service.create(
          {
            vehicle_id: VEHICLE_ID,
            start_date: daysFromNow(1),
            end_date: daysFromNow(2),
          },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
