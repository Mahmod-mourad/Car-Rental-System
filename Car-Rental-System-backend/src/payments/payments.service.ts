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

  /**
   * Total of the payments that have actually completed for a booking.
   * Postgres hands back decimals as strings, so this parses rather than adds.
   */
  private async completedTotal(bookingId: string): Promise<number> {
    const row = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.amount), 0)', 'total')
      .where('payment.booking_id = :bookingId', { bookingId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne<{ total: string }>();

    return Number(row?.total ?? 0);
  }

  /** Recomputes a booking's payment_status from its completed payments. */
  private async refreshBookingPaymentStatus(bookingId: string, bookingTotal: number): Promise<void> {
    const paid = await this.completedTotal(bookingId);

    await this.bookingsRepository.update(bookingId, {
      payment_status:
        paid >= bookingTotal ? BookingPaymentStatus.PAID : BookingPaymentStatus.PENDING,
    });
  }

  async create(createPaymentDto: CreatePaymentDto, userId: string): Promise<Payment> {
    const { booking_id, payment_method, transaction_id, metadata } = createPaymentDto;

    const booking = await this.bookingsRepository.findOne({
      where: { id: booking_id },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.user.id !== userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new ForbiddenException('You are not authorized to create a payment for this booking');
      }
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot pay for a cancelled booking');
    }

    // The amount is never taken from the request. It is whatever is still owed on
    // the booking, so a caller cannot pay one pound for a thousand-pound rental —
    // nor overpay by sending a huge number to force the booking to look settled.
    const bookingTotal = Number(booking.total_price);
    const alreadyPaid = await this.completedTotal(booking_id);
    const amountDue = Number((bookingTotal - alreadyPaid).toFixed(2));

    if (amountDue <= 0) {
      throw new BadRequestException('This booking is already paid in full');
    }

    const payment = this.paymentsRepository.create({
      amount: amountDue,
      payment_method,
      transaction_id,
      // A new payment is always pending. Only a completed payment can settle a
      // booking, and completing one is an admin action — see update().
      status: PaymentStatus.PENDING,
      metadata,
      booking: { id: booking_id },
    });

    return this.paymentsRepository.save(payment);
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

    // Settling a payment is an administrative act, not something the person who
    // owes the money can do. Previously the booking's own owner could PATCH their
    // payment to 'completed' and mark the booking paid without paying anything.
    const actor = await this.usersRepository.findOne({ where: { id: userId } });
    if (!actor || actor.role !== 'admin') {
      throw new ForbiddenException('Only administrators can update a payment');
    }

    const { status, failure_reason, transaction_id, metadata } = updatePaymentDto;

    // The amount and the booking a payment belongs to are fixed once it exists.
    if (status !== undefined) payment.status = status;
    if (failure_reason !== undefined) (payment as any).failure_reason = failure_reason;
    if (transaction_id !== undefined) payment.transaction_id = transaction_id;
    if (metadata !== undefined) payment.metadata = metadata;

    const saved = await this.paymentsRepository.save(payment);

    // Recompute from the payments that actually completed rather than trusting the
    // one being edited — a refund has to be able to move a booking back to unpaid.
    await this.refreshBookingPaymentStatus(
      payment.booking.id,
      Number(payment.booking.total_price),
    );

    return saved;
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
