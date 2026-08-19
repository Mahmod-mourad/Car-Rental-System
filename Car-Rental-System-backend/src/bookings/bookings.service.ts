import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Not } from 'typeorm';
import { Booking, BookingStatus, BookingPaymentStatus } from '../database/entities/booking.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { User } from '../database/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../database/entities/notification.entity';
import { UpdateBookingDto } from './dto/update-booking.dto';

export interface BookingSearchOptions {
  userId?: string;
  vehicleId?: string;
  status?: BookingStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private notificationsService: NotificationsService,
  ) {}

  /** Whole days between the pickup day and the return day, minimum one. */
  private rentalDays(startDate: Date, endDate: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.round((endDate.getTime() - startDate.getTime()) / msPerDay);
    return Math.max(days, 1);
  }

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const { vehicle_id, start_date, end_date, notes } = createBookingDto;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('start_date and end_date must be valid dates');
    }

    if (endDate <= startDate) {
      throw new BadRequestException('end_date must be after start_date');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      throw new BadRequestException('start_date cannot be in the past');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Everything below runs in one transaction. The vehicle row is locked first, so
    // two requests for the same vehicle are serialised: without the lock both could
    // pass the overlap check before either had inserted its booking, and the vehicle
    // would end up double-booked.
    return this.dataSource.transaction(async (manager) => {
      const vehicle = await manager.findOne(Vehicle, {
        where: { id: vehicle_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      if (!vehicle.available) {
        throw new BadRequestException('Vehicle is not available for booking');
      }

      const conflict = await manager
        .createQueryBuilder(Booking, 'booking')
        .where('booking.vehicle_id = :vehicleId', { vehicleId: vehicle_id })
        .andWhere('booking.status != :cancelled', { cancelled: BookingStatus.CANCELLED })
        // Two ranges overlap when each one starts before the other ends. Treating the
        // return day as occupied means a same-day handover counts as a conflict.
        .andWhere('booking.start_date <= :endDate AND booking.end_date >= :startDate', {
          startDate,
          endDate,
        })
        .getOne();

      if (conflict) {
        throw new ConflictException('The vehicle is already booked for the selected dates');
      }

      // The client does not get to name its own price. The total is derived from the
      // vehicle's stored daily rate, so a tampered request cannot rent a car for zero.
      const days = this.rentalDays(startDate, endDate);
      const totalPrice = Number(vehicle.price_per_day) * days;

      const booking = manager.create(Booking, {
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        notes: notes ?? null,
        status: BookingStatus.PENDING,
        payment_status: BookingPaymentStatus.PENDING,
        user_id: userId,
        vehicle_id: vehicle_id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const saved = await manager.save(Booking, booking);

      // Written inside the same transaction: a booking that rolls back must not
      // leave a notification behind saying it succeeded.
      await this.notificationsService.create(
        {
          userId: userId,
          type: NotificationType.BOOKING_CREATED,
          title: 'Booking requested',
          body: `Your booking for the ${vehicle.make} ${vehicle.model} from ${start_date} to ${end_date} is awaiting confirmation.`,
          referenceId: saved.id,
        },
        manager,
      );

      return manager.findOneOrFail(Booking, {
        where: { id: saved.id },
        relations: ['user', 'vehicle'],
      });
    });
  }

  async findAll(filters: BookingSearchOptions = {}): Promise<{ data: Booking[]; count: number }> {
    const {
      userId,
      vehicleId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;
    const query = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.owner', 'owner');

    const whereConditions: string[] = [];
    const params: Record<string, any> = {};

    if (userId) {
      whereConditions.push('booking.userId = :userId');
      params.userId = userId;
    }

    if (vehicleId) {
      whereConditions.push('booking.vehicleId = :vehicleId');
      params.vehicleId = vehicleId;
    }

    if (status) {
      whereConditions.push('booking.status = :status');
      params.status = status;
    }

    if (startDate) {
      whereConditions.push('booking.start_date >= :startDate');
      params.startDate = new Date(startDate);
    }

    if (endDate) {
      whereConditions.push('booking.end_date <= :endDate');
      params.endDate = new Date(endDate);
    }

    if (whereConditions.length > 0) {
      query.where(whereConditions.join(' AND '), params);
    }

    const [data, count] = await query
      .orderBy('booking.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle', 'payments'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    userId: string,
    isAdmin = false,
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    
    // Check if the user is the owner of the booking or an admin
    if (booking.user.id !== userId && !isAdmin) {
      throw new ForbiddenException('You are not authorized to update this booking');
    }

    // If updating dates, check for conflicts
    if (updateBookingDto.start_date || updateBookingDto.end_date) {
      const startDate = updateBookingDto.start_date ? new Date(updateBookingDto.start_date) : booking.start_date;
      const endDate = updateBookingDto.end_date ? new Date(updateBookingDto.end_date) : booking.end_date;

      const conflictingBooking = await this.bookingsRepository
        .createQueryBuilder('booking')
        .where('booking.id != :id', { id })
        .andWhere('booking.vehicle_id = :vehicleId', { vehicleId: booking.vehicle.id })
        .andWhere('booking.status != :cancelled', { cancelled: BookingStatus.CANCELLED })
        .andWhere(
          '(:startDate BETWEEN booking.start_date AND booking.end_date) OR ' +
          '(:endDate BETWEEN booking.start_date AND booking.end_date) OR ' +
          '(booking.start_date <= :startDate AND booking.end_date >= :endDate)'
        )
        .setParameters({
          startDate,
          endDate
        })
        .getOne();

      if (conflictingBooking) {
        throw new BadRequestException('The vehicle is already booked for the selected dates');
      }
    }

    // Update the booking
    Object.assign(booking, updateBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async cancel(id: string, userId: string, isAdmin = false): Promise<Booking> {
    const booking = await this.findOne(id);
    
    // Check if the user is the owner of the booking or an admin
    if (booking.user.id !== userId && !isAdmin) {
      throw new ForbiddenException('You are not authorized to cancel this booking');
    }

    // Check if the booking can be cancelled
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    // Update the booking status
    booking.status = BookingStatus.CANCELLED;
    return this.bookingsRepository.save(booking);
  }

  async getVehicleBookings(vehicleId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: ['user'],
      order: { start_date: 'ASC' },
    });
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['vehicle'],
      order: { start_date: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
    userId: string,
    isAdmin = false,
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    
    // Only admin or the vehicle owner can update the status
    if (booking.vehicle.owner.id !== userId && !isAdmin) {
      throw new ForbiddenException('You are not authorized to update the status of this booking');
    }

    // Validate status transition
    if (
      (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) &&
      status !== booking.status
    ) {
      throw new BadRequestException(`Cannot change status from ${booking.status} to ${status}`);
    }

    booking.status = status;
    return this.bookingsRepository.save(booking);
  }
}
