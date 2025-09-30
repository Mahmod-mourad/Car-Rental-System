import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { Payment } from './payment.entity';
import { Review } from './review.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum BookingPaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  start_date: Date;

  @Column('date')
  end_date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: BookingPaymentStatus,
    default: BookingPaymentStatus.PENDING,
  })
  payment_status: BookingPaymentStatus;

  @Column('timestamp')
  created_at: Date;

  @Column('timestamp')
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.bookings)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column('uuid')
  vehicle_id: string;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @OneToOne(() => Review, (review) => review.booking)
  review: Review;
}
