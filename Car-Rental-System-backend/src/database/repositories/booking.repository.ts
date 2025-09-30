import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class BookingRepository extends BaseRepository<Booking> {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {
    super(bookingRepository);
  }

  async findUserBookings(
    userId: string,
    status?: BookingStatus,
  ): Promise<Booking[]> {
    const where: any = { user_id: userId };
    if (status) {
      where.status = status;
    }

    return this.bookingRepository.find({
      where,
      relations: ['vehicle', 'payments'],
      order: { start_date: 'DESC' },
    });
  }

  async findVehicleBookings(
    vehicleId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Booking[]> {
    const where: any = { vehicle_id: vehicleId };
    
    if (startDate && endDate) {
      where.start_date = Between(startDate, endDate);
    }

    return this.bookingRepository.find({
      where,
      relations: ['user', 'payments'],
      order: { start_date: 'ASC' },
    });
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<void> {
    await this.bookingRepository.update(bookingId, { status });
  }

  async findBookingsByDateRange(
    startDate: Date,
    endDate: Date,
    status?: BookingStatus,
  ): Promise<Booking[]> {
    const where: any = {
      start_date: Between(startDate, endDate),
    };

    if (status) {
      where.status = status;
    }

    return this.bookingRepository.find({
      where,
      relations: ['user', 'vehicle', 'payments'],
      order: { start_date: 'ASC' },
    });
  }
}
