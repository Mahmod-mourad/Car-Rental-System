import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Review } from './review.entity';
import { Point } from '../../common/types/postgis.types';

// Import Booking entity type only for type information
// Using a type-only import to avoid runtime issues
type Booking = any; // Temporary type until we have the actual Booking entity

export enum VehicleType {
  SEDAN = 'sedan',
  SUV = 'suv',
  TRUCK = 'truck',
  VAN = 'van',
  LUXURY = 'luxury',
}

export enum TransmissionType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column('int')
  year: number;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type: VehicleType;

  @Column({
    type: 'enum',
    enum: TransmissionType,
  })
  transmission: TransmissionType;

  @Column({
    type: 'enum',
    enum: FuelType,
  })
  fuel_type: FuelType;

  @Column('int')
  seats: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price_per_day: number;

  @Column('boolean', { default: true })
  available: boolean;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  average_rating: number;

  @Column('int', { default: 0 })
  review_count: number;

  @Column('boolean', { default: false })
  is_featured: boolean;

  @Column('geometry', {
    type: 'point',
    srid: 4326,
    nullable: true,
  } as any) // Using any to bypass TypeORM type issues with PostGIS
  location: any; // Using any for now to avoid TypeORM type issues with PostGIS

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column('jsonb', { nullable: true })
  features: Record<string, any>;

  @Column('timestamp')
  created_at: Date;

  @Column('timestamp')
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.vehicles)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column('uuid')
  owner_id: string;

  @OneToMany('Booking', (booking: any) => booking.vehicle, {
    cascade: true,
  })
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.vehicle)
  reviews: Review[];
}
