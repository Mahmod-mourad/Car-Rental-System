import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentMethod } from './dto/create-payment.dto';
import { PaymentStatus } from './dto/update-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { Payment } from '../database/entities/payment.entity';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment successfully created', type: Payment })
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    return this.paymentsService.create(createPaymentDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all payments (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return list of payments', type: [Payment] })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'method', required: false, enum: PaymentMethod })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'minAmount', required: false, type: Number })
  @ApiQuery({ name: 'maxAmount', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('status') status?: PaymentStatus,
    @Query('method') method?: PaymentMethod,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('minAmount', new DefaultValuePipe(0), ParseIntPipe) minAmount = 0,
    @Query('maxAmount', new DefaultValuePipe(0), ParseIntPipe) maxAmount = 0,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.paymentsService.findAll(
      undefined, // userId (admin sees all)
      {
        status,
        method,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
      },
      page,
      limit,
    );
  }

  @Get('my-payments')
  @ApiOperation({ summary: 'Get current user\'s payments' })
  @ApiResponse({ status: 200, description: 'Return list of user payments', type: [Payment] })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findUserPayments(
    @Req() req,
    @Query('status') status?: PaymentStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.paymentsService.findAll(
      req.user.userId,
      { status },
      page,
      limit,
    );
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get payments for a specific booking' })
  @ApiResponse({ status: 200, description: 'Return list of booking payments', type: [Payment] })
  getBookingPayments(@Param('bookingId') bookingId: string, @Req() req) {
    return this.paymentsService.getBookingPayments(bookingId, req.user.userId);
  }

  @Get('booking/:bookingId/total-paid')
  @ApiOperation({ summary: 'Get total amount paid for a booking' })
  @ApiResponse({ status: 200, description: 'Return total amount paid', type: Number })
  async getTotalPaid(@Param('bookingId') bookingId: string, @Req() req) {
    // Verify the user has access to this booking
    await this.paymentsService.getBookingPayments(bookingId, req.user.userId);
    return this.paymentsService.getTotalPaid(bookingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiResponse({ status: 200, description: 'Return the payment', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.paymentsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a payment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully', type: Payment })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Req() req,
  ) {
    return this.paymentsService.update(id, updatePaymentDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a payment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(@Param('id') id: string, @Req() req) {
    return this.paymentsService.remove(id, req.user.userId);
  }

  @Post(':id/refund')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process a refund (Admin only)' })
  @ApiResponse({ status: 201, description: 'Refund processed successfully', type: Payment })
  @ApiResponse({ status: 400, description: 'Invalid refund request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async processRefund(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('reason') reason: string,
    @Req() req,
  ) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('A valid refund amount is required');
    }
    if (!reason) {
      throw new BadRequestException('A reason for the refund is required');
    }

    return this.paymentsService.processRefund(id, amount, reason, req.user.userId);
  }
}
