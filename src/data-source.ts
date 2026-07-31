import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres.vgpvhoxptqjhfmmgstsb',
  password: process.env.DB_PASSWORD || 'somasundaram@1972',
  database: process.env.DB_NAME || 'postgres',
  synchronize: false,
  ssl: { rejectUnauthorized: false },
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
} as DataSourceOptions);


