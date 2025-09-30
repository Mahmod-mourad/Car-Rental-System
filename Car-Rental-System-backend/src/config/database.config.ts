import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

function getEnvVar(key: string, defaultValue: string): string {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: getEnvVar('DATABASE_HOST', 'localhost'),
  port: parseInt(getEnvVar('DATABASE_PORT', '5432'), 10),
  username: getEnvVar('DATABASE_USERNAME', 'postgres'),
  password: getEnvVar('DATABASE_PASSWORD', 'postgres'),
  database: getEnvVar('DATABASE_NAME', 'car_rental'),
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false,
  migrationsTableName: 'migrations',
  extra: {
    // For SSL connection (if needed)
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
} as TypeOrmModuleOptions;

// This is used by TypeORM CLI for migrations
export const dataSource = new DataSource({
  ...typeOrmConfig,
  type: 'postgres',
} as DataSourceOptions);

export default typeOrmConfig;
