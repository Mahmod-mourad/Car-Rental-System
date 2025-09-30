import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
config();

const configService = new ConfigService();

// Helper function to get database URL with SSL configuration
const getDatabaseUrl = (): string => {
  const url = configService.get('DATABASE_URL');
  if (configService.get('NODE_ENV') === 'production') {
    return `${url}?sslmode=require`;
  }
  return url;
};

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: getDatabaseUrl(),
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false, // Always false in production
  logging: configService.get('NODE_ENV') === 'development',
  ssl: configService.get('NODE_ENV') === 'production' ? { 
    rejectUnauthorized: false 
  } : false,
  migrationsRun: false, // We'll run migrations manually
  migrationsTableName: 'migrations',
  // Enable PostGIS support
  installExtensions: true,
  extra: {
    // This enables the PostGIS extension to be loaded when the connection is established
    // It's equivalent to running 'CREATE EXTENSION IF NOT EXISTS postgis' on connection
    // This requires the 'pg' package to be installed
    connection: {
      statement_timeout: 10000, // 10 seconds
    },
  },
};

// For CLI usage
export default new DataSource({
  ...typeOrmConfig,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
