import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between, Or } from 'typeorm';
import { Payment } from '../database/entities/payment.entity';
import { Booking, BookingStatus, BookingPaymentStatus } from '../database/entities/booking.entity';
import { User } from '../database/entities/user.entity';
import { CreatePaymentDto, PaymentMethod } from './dto/create-payment.dto';
import { UpdatePaymentDto, PaymentStatus } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, userId: string): Promise<Payment> {
    const { booking_id, amount, payment_method, transaction_id, metadata } = createPaymentDto;
    
    // Verify the booking exists and belongs to the user
    const booking = await this.bookingsRepository.findOne({
      where: { id: booking_id },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user is authorized (owner of booking or admin)
    if (booking.user.id !== userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new ForbiddenException('You are not authorized to create a payment for this booking');
      }
    }

    // Create the payment
    const payment = this.paymentsRepository.create({
      amount,
      payment_method,
      transaction_id,
      status: PaymentStatus.PENDING,
      metadata,
      booking: { id: booking_id },
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // Update booking payment status if needed
    if (booking.payment_status !== BookingPaymentStatus.PAID && amount >= booking.total_price) {
      await this.bookingsRepository.update(booking_id, {
        payment_status: BookingPaymentStatus.PAID,
      });
    } else if (amount > 0) {
      // For partial payments, we'll keep it as PENDING
      // You might want to implement a different status for partial payments
      await this.bookingsRepository.update(booking_id, {
        payment_status: BookingPaymentStatus.PENDING,
      });
    }

    return savedPayment;
  }

  async findAll(
    userId?: string,
    filters: {
      status?: PaymentStatus;
      startDate?: Date;
      endDate?: Date;
      minAmount?: number;
      maxAmount?: number;
      method?: PaymentMethod;
    } = {},
    page = 1,
    limit = 10,
  ): Promise<{ data: Payment[]; count: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    // Apply filters
    if (filters.status) where.status = filters.status;
    if (filters.method) where.payment_method = filters.method;
    
    if (filters.startDate || filters.endDate) {
      where.created_at = Between(
        filters.startDate || new Date(0),
        filters.endDate || new Date(),
      );
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = Between(
        filters.minAmount !== undefined ? filters.minAmount : 0,
        filters.maxAmount !== undefined ? filters.maxAmount : Number.MAX_SAFE_INTEGER,
      );
    }

    // If user ID is provided, only return their payments (unless they're admin)
    if (userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        where.booking = { user: { id: userId } };
      }
    }

    const [data, count] = await this.paymentsRepository.findAndCount({
      where,
      relations: ['booking', 'booking.user', 'booking.vehicle'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return { data, count };
  }

  async findOne(id: string, userId?: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['booking', 'booking.user', 'booking.vehicle'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Check if user is authorized (owner of booking or admin)
    if (userId && payment.booking.user.id !== userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new ForbiddenException('You are not authorized to view this payment');
      }
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, userId: string): Promise<Payment> {
    const payment = await this.findOne(id, userId);
    
    // Check if user is authorized (admin or owner of the booking)
    if (payment.booking.user.id !== userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new ForbiddenException('You are not authorized to update this payment');
      }
    }

    // Update payment
    Object.assign(payment, updatePaymentDto);
    
    // If status is being updated to COMPLETED, update the booking payment status
    if (updatePaymentDto.status === PaymentStatus.COMPLETED) {
      await this.bookingsRepository.update(payment.booking.id, {
        payment_status: BookingPaymentStatus.PAID,
      });
    }

    return this.paymentsRepository.save(payment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const payment = await this.findOne(id, userId);
    
    // Only admin can delete payments
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Only administrators can delete payments');
    }

    await this.paymentsRepository.remove(payment);
  }

  async getBookingPayments(bookingId: string, userId?: string): Promise<Payment[]> {
    const where: any = { booking: { id: bookingId } };
    
    // If user ID is provided, verify they have access to this booking
    if (userId) {
      const booking = await this.bookingsRepository.findOne({
        where: { id: bookingId },
        relations: ['user'],
      });
      
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      
      if (booking.user.id !== userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user || user.role !== 'admin') {
          throw new ForbiddenException('You are not authorized to view these payments');
        }
      }
    }

    return this.paymentsRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async getTotalPaid(bookingId: string): Promise<number> {
    const result = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.booking_id = :bookingId', { bookingId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED }) // This is correct as it's using PaymentStatus for payments
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async processRefund(
    paymentId: string,
    amount: number,
    reason: string,
    userId: string,
  ): Promise<Payment> {
    const payment = await this.findOne(paymentId, userId);
    
    // Only admin can process refunds
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Only administrators can process refunds');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    if (amount <= 0 || amount > payment.amount) {
      throw new BadRequestException('Invalid refund amount');
    }

    // Create a refund record (negative payment)
    const refund = this.paymentsRepository.create({
      amount: -amount,
      payment_method: payment.payment_method,
      status: PaymentStatus.REFUNDED,
      metadata: {
        original_payment_id: payment.id,
        reason,
      },
      booking: { id: payment.booking.id },
    });

    // If full amount is being refunded, update the original payment status
    if (amount === payment.amount) {
      payment.status = PaymentStatus.REFUNDED;
      await this.paymentsRepository.save(payment);
    } else {
      // For partial refund, we can create a new payment record with negative amount
      // and optionally update the original payment metadata
      payment.metadata = payment.metadata || {};
      payment.metadata.partial_refund = {
        amount,
        refund_id: refund.id,
        timestamp: new Date().toISOString(),
        reason,
      };
      payment.status = PaymentStatus.PARTIALLY_REFUNDED;
      await this.paymentsRepository.save(payment);
    }

    return this.paymentsRepository.save(refund);
  }
}
