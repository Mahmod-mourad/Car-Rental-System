import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Booking, BookingStatus, BookingPaymentStatus } from '../database/entities/booking.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { User } from '../database/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
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
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const { vehicle_id, start_date, end_date, total_price, notes } = createBookingDto;
    
    // Check if the vehicle exists and is available
    const vehicle = await this.vehiclesRepository.findOne({ where: { id: vehicle_id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    
    if (!vehicle.available) {
      throw new BadRequestException('Vehicle is not available for booking');
    }

    // Verify the user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for date conflicts
    const existingBooking = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.vehicle_id = :vehicleId', { vehicleId: vehicle_id })
      .andWhere('booking.status != :cancelled', { cancelled: BookingStatus.CANCELLED })
      .andWhere(
        '(:startDate BETWEEN booking.start_date AND booking.end_date) OR ' +
        '(:endDate BETWEEN booking.start_date AND booking.end_date) OR ' +
        '(booking.start_date <= :startDate AND booking.end_date >= :endDate)'
      )
      .setParameters({
        startDate: new Date(start_date),
        endDate: new Date(end_date)
      })
      .getOne();

    if (existingBooking) {
      throw new BadRequestException('The vehicle is already booked for the selected dates');
    }

    // Create the booking
    const booking = new Booking();
    booking.start_date = new Date(start_date);
    booking.end_date = new Date(end_date);
    booking.total_price = total_price;
    // Remove notes if it doesn't exist in the entity
    // booking.notes = notes;
    booking.status = BookingStatus.PENDING;
    booking.payment_status = BookingPaymentStatus.PENDING;
    booking.user = { id: userId } as User;
    booking.vehicle = { id: vehicle_id } as Vehicle;
    booking.created_at = new Date();
    booking.updated_at = new Date();

    const savedBooking = await this.bookingsRepository.save(booking);
    return this.bookingsRepository.findOneOrFail({
      where: { id: savedBooking.id },
      relations: ['user', 'vehicle']
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
