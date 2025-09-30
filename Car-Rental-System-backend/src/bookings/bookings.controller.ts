import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch, 
  Query, 
  UseGuards, 
  Req, 
  ParseIntPipe, 
  DefaultValuePipe, 
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { BookingsService, BookingSearchOptions } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { Booking, BookingStatus } from '../database/entities/booking.entity';

@ApiTags('Bookings')
@Controller('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking successfully created', type: Booking })
  create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(createBookingDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all bookings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return list of bookings', type: [Booking] })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'vehicleId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('userId') userId?: string,
    @Query('vehicleId') vehicleId?: string,
    @Query('status') status?: BookingStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const options: BookingSearchOptions = {
      userId,
      vehicleId,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      limit,
    };
    return this.bookingsService.findAll(options);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user\'s bookings' })
  @ApiResponse({ status: 200, description: 'Return list of user bookings', type: [Booking] })
  findUserBookings(@Req() req) {
    return this.bookingsService.getUserBookings(req.user.userId);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get bookings for a specific vehicle' })
  @ApiResponse({ status: 200, description: 'Return list of vehicle bookings', type: [Booking] })
  findVehicleBookings(@Param('vehicleId') vehicleId: string) {
    return this.bookingsService.getVehicleBookings(vehicleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({ status: 200, description: 'Return the booking', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Param('id') id: string, @Req() req) {
    const booking = await this.bookingsService.findOne(id);
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    
    // Users can only see their own bookings unless they're admin
    if (booking.user.id !== req.user.userId && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not authorized to view this booking');
    }
    
    return booking;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully', type: Booking })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req,
  ) {
    return this.bookingsService.update(
      id,
      updateBookingDto,
      req.user.userId,
      req.user.role === UserRole.ADMIN,
    );
  }

  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot cancel booking' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  cancel(@Param('id') id: string, @Req() req) {
    return this.bookingsService.cancel(id, req.user.userId, req.user.role === UserRole.ADMIN);
  }

  @Patch(':id/status/:status')
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update booking status (Agents and Admins only)' })
  @ApiResponse({ status: 200, description: 'Booking status updated', type: Booking })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: BookingStatus,
    @Req() req,
  ) {
    return this.bookingsService.updateStatus(
      id,
      status,
      req.user.userId,
      req.user.role === UserRole.ADMIN,
    );
  }
}
