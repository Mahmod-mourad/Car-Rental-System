import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    super(paymentRepository);
  }

  async findPaymentsByUser(
    userId: string,
    status?: PaymentStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Payment[]> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.booking', 'booking')
      .where('booking.user_id = :userId', { userId });

    if (status) {
      query.andWhere('payment.status = :status', { status });
    }

    if (startDate && endDate) {
      query.andWhere('payment.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return query.orderBy('payment.created_at', 'DESC').getMany();
  }

  async findPaymentsByBooking(bookingId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { booking_id: bookingId },
      order: { created_at: 'DESC' },
    });
  }

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    transactionId?: string,
  ): Promise<void> {
    const updateData: any = { status };
    if (transactionId) {
      updateData.transaction_id = transactionId;
    }
    
    await this.paymentRepository.update(paymentId, updateData);
  }

  async getTotalRevenue(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ total: number; count: number }> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .addSelect('COUNT(payment.id)', 'count')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED });

    if (startDate && endDate) {
      query.andWhere('payment.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const result = await query.getRawOne();
    return {
      total: parseFloat(result.total) || 0,
      count: parseInt(result.count, 10) || 0,
    };
  }
}
