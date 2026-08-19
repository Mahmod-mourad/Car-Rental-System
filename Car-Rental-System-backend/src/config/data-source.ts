import { DataSource, DataSourceOptions } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';

loadEnv();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * The single database configuration for this app.
 *
 * Both the Nest runtime and the TypeORM CLI read from here, so migrations run
 * against exactly the same schema the app connects to.
 *
 * `synchronize` stays off everywhere. The schema is owned by the migrations in
 * src/database/migrations — letting TypeORM auto-sync in development would drift
 * the local schema away from what the migrations produce in production.
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'car_rental',
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
  migrationsRun: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

// Default export is what the TypeORM CLI picks up for migration commands.
export default new DataSource(dataSourceOptions);
