import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../database/entities/booking.entity';
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
export declare class BookingsService {
    private bookingsRepository;
    private vehiclesRepository;
    private usersRepository;
    constructor(bookingsRepository: Repository<Booking>, vehiclesRepository: Repository<Vehicle>, usersRepository: Repository<User>);
    create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking>;
    findAll(filters?: BookingSearchOptions): Promise<{
        data: Booking[];
        count: number;
    }>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto, userId: string, isAdmin?: boolean): Promise<Booking>;
    cancel(id: string, userId: string, isAdmin?: boolean): Promise<Booking>;
    getVehicleBookings(vehicleId: string): Promise<Booking[]>;
    getUserBookings(userId: string): Promise<Booking[]>;
    updateStatus(id: string, status: BookingStatus, userId: string, isAdmin?: boolean): Promise<Booking>;
}
