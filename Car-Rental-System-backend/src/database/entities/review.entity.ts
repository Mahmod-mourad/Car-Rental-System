import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { nullable: false })
  rating: number; // 1-5

  @Column('text', { nullable: true })
  comment: string;

  @Column('jsonb', { nullable: true })
  response: {
    comment: string;
    responded_at: Date;
  };

  @Column('timestamp')
  created_at: Date;

  @Column('timestamp', { nullable: true })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.reviews)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column('uuid')
  vehicle_id: string;

  @OneToOne(() => Booking, (booking) => booking.review)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column('uuid')
  booking_id: string;
}
