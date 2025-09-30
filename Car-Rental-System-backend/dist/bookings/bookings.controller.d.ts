import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from '../database/entities/booking.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, req: any): Promise<Booking>;
    findAll(userId?: string, vehicleId?: string, status?: BookingStatus, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<{
        data: Booking[];
        count: number;
    }>;
    findUserBookings(req: any): Promise<Booking[]>;
    findVehicleBookings(vehicleId: string): Promise<Booking[]>;
    findOne(id: string, req: any): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto, req: any): Promise<Booking>;
    cancel(id: string, req: any): Promise<Booking>;
    updateStatus(id: string, status: BookingStatus, req: any): Promise<Booking>;
}
