import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const AppConfig = () => {
  return {
    allowUrls: process.env.ALLOW_URLS?.split(',') || ['http://localhost:3000'],
    aws: {
      bucket: process.env.AWS_S3_BUCKET || 'test',
      region: process.env.AWS_S3_REGION || 'test',
      accessKeyId: process.env.AWS_S3_ACCESS_KEY || 'test',
      secretAccessKey: process.env.AWS_S3_SECRET_KEY || 'test',
    },
    cache: {
      host: process.env.CACHE_HOST || 'localhost',
      port: parseInt(process.env.CACHE_PORT, 10) || 6379,
      ttl: parseInt(process.env.CACHE_TTL) || 600,
      url: process.env.CACHE_URL || 'redis://127.0.0.1:6379/0',
    },
    database: {
      type: 'postgres' as const,
      host: `${process.env.DB_HOST}` || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: `${process.env.DB_USERNAME}` || 'test',
      password: `${process.env.DB_PASSWORD}` || '123',
      database: `${process.env.DB_NAME}` || 'testing',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/*{.ts,.js}'],
      seeds: ['dist/database/seeders/*{.ts,.js}'],
      factories: ['dist/**/*.factory{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      ttl: parseInt(process.env.JWT_TTL) || 600,
      refreshTtl: parseInt(process.env.JWT_REFRESH_TTL) || 2592000,
    },
  };
};

export default AppConfig;
