import * as bcrypt from 'bcrypt';

import dataSource from '../../config/data-source';
import { User, UserRole } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { createPoint } from '../../common/types/postgis.types';
import {
  FuelType,
  TransmissionType,
  Vehicle,
  VehicleType,
} from '../entities/vehicle.entity';

/**
 * Loads a small, realistic dataset so a fresh database is usable straight away.
 *
 * Safe to run more than once: every record is looked up by a natural key first,
 * so a second run updates nothing and creates nothing.
 *
 * The demo accounts below exist only for local development. They are printed on
 * completion because they are meant to be known — unlike the hardcoded admin
 * login this project used to ship, these are ordinary rows with real bcrypt
 * hashes, and the API treats them like any other account.
 */

const DEMO_PASSWORD = 'Password123!';

const DEMO_USERS = [
  {
    email: 'admin@carrental.local',
    role: UserRole.ADMIN,
    first: 'Admin',
    last: 'User',
  },
  {
    email: 'agent@carrental.local',
    role: UserRole.AGENT,
    first: 'Sara',
    last: 'Fahmy',
  },
  {
    email: 'customer@carrental.local',
    role: UserRole.CUSTOMER,
    first: 'Nour',
    last: 'Hassan',
  },
];

// Coordinates are real places in Cairo, so the radius search returns something
// sensible when you try it.
const VEHICLES = [
  {
    make: 'Toyota',
    model: 'Corolla',
    year: 2023,
    type: VehicleType.SEDAN,
    transmission: TransmissionType.AUTOMATIC,
    fuel_type: FuelType.GASOLINE,
    seats: 5,
    doors: 4,
    price_per_day: 250,
    color: 'Silver',
    mileage: 42000,
    location_name: 'Cairo International Airport',
    lat: 30.1219,
    lng: 31.4056,
    description: 'Economical daily driver with full service history.',
    features: ['Bluetooth', 'Cruise control', 'Reversing camera'],
    is_featured: true,
  },
  {
    make: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    type: VehicleType.SUV,
    transmission: TransmissionType.AUTOMATIC,
    fuel_type: FuelType.DIESEL,
    seats: 5,
    doors: 5,
    price_per_day: 420,
    color: 'White',
    mileage: 61000,
    location_name: 'Nasr City Branch',
    lat: 30.0561,
    lng: 31.3301,
    description: 'Family SUV with generous boot space and roof rails.',
    features: ['Roof rails', 'Parking sensors', 'Apple CarPlay'],
    is_featured: true,
  },
  {
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2024,
    type: VehicleType.LUXURY,
    transmission: TransmissionType.AUTOMATIC,
    fuel_type: FuelType.GASOLINE,
    seats: 5,
    doors: 4,
    price_per_day: 1100,
    color: 'Black',
    mileage: 12000,
    location_name: 'Zamalek Branch',
    lat: 30.0614,
    lng: 31.2197,
    description:
      'Executive saloon with leather interior and driver assistance.',
    features: ['Leather seats', 'Lane assist', 'Heated seats', 'Sunroof'],
    is_featured: true,
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: VehicleType.SEDAN,
    transmission: TransmissionType.AUTOMATIC,
    fuel_type: FuelType.ELECTRIC,
    seats: 5,
    doors: 4,
    price_per_day: 700,
    color: 'Blue',
    mileage: 25000,
    location_name: 'New Cairo Branch',
    lat: 30.0086,
    lng: 31.4913,
    description: 'Fully electric, roughly 500 km of range on a full charge.',
    features: ['Autopilot', 'Fast charging', 'Glass roof'],
    is_featured: false,
  },
  {
    make: 'Toyota',
    model: 'Hiace',
    year: 2021,
    type: VehicleType.VAN,
    transmission: TransmissionType.MANUAL,
    fuel_type: FuelType.DIESEL,
    seats: 12,
    doors: 4,
    price_per_day: 550,
    color: 'White',
    mileage: 130000,
    location_name: 'Giza Branch',
    lat: 30.0131,
    lng: 31.2089,
    description: 'Twelve-seat van for group travel and airport transfers.',
    features: ['Air conditioning', 'High roof'],
    is_featured: false,
  },
  {
    make: 'Kia',
    model: 'Sportage',
    year: 2023,
    type: VehicleType.SUV,
    transmission: TransmissionType.AUTOMATIC,
    fuel_type: FuelType.HYBRID,
    seats: 5,
    doors: 5,
    price_per_day: 480,
    color: 'Grey',
    mileage: 18000,
    location_name: 'Heliopolis Branch',
    lat: 30.0885,
    lng: 31.3245,
    description: 'Hybrid crossover, easy on fuel in city traffic.',
    features: ['Hybrid drive', 'Wireless charging', 'Blind spot monitor'],
    is_featured: false,
  },
];

async function seed(): Promise<void> {
  await dataSource.initialize();

  const users = dataSource.getRepository(User);
  const profiles = dataSource.getRepository(Profile);
  const vehicles = dataSource.getRepository(Vehicle);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const created: User[] = [];

  for (const demo of DEMO_USERS) {
    let user = await users.findOne({ where: { email: demo.email } });

    if (!user) {
      user = await users.save(
        users.create({
          email: demo.email,
          password_hash: passwordHash,
          role: demo.role,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      );

      const profile = profiles.create();
      profile.user_id = user.id;
      profile.first_name = demo.first;
      profile.last_name = demo.last;
      await profiles.save(profile);
    }

    created.push(user);
  }

  const owner =
    created.find((user) => user.role === UserRole.AGENT) ?? created[0];

  for (const spec of VEHICLES) {
    const existing = await vehicles.findOne({
      where: { make: spec.make, model: spec.model, year: spec.year },
    });
    if (existing) continue;

    const { lat, lng, ...fields } = spec;

    const vehicle = vehicles.create({
      ...fields,
      available: true,
      air_conditioning: true,
      images: [],
      owner,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Geometry columns take GeoJSON; createPoint builds it with the right SRID.
    vehicle.location = createPoint(lng, lat);

    await vehicles.save(vehicle);
  }

  const vehicleCount = await vehicles.count();
  const userCount = await users.count();

  console.log(`Seed complete: ${userCount} users, ${vehicleCount} vehicles.`);
  console.log('Demo accounts (local development only):');
  for (const demo of DEMO_USERS) {
    console.log(`  ${demo.role.padEnd(9)} ${demo.email}  ${DEMO_PASSWORD}`);
  }

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
