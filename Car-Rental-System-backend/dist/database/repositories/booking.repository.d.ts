import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { BaseRepository } from './base.repository';
export declare class BookingRepository extends BaseRepository<Booking> {
    private readonly bookingRepository;
    constructor(bookingRepository: Repository<Booking>);
    findUserBookings(userId: string, status?: BookingStatus): Promise<Booking[]>;
    findVehicleBookings(vehicleId: string, startDate?: Date, endDate?: Date): Promise<Booking[]>;
    updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void>;
    findBookingsByDateRange(startDate: Date, endDate: Date, status?: BookingStatus): Promise<Booking[]>;
}
