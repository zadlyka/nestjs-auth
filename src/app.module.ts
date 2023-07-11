import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { CommonModule } from './common/common.module';
import AppConfig from './config/app.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WrapInterceptor } from './common/interceptor/wrap.interceptor';
import { JwtAuthGuard } from './authentication/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './authentication/auth/guards/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore as unknown as CacheStore,
        url: configService.get('cache.url'),
        port: configService.get('cache.port'),
        ttl: configService.get('cache.ttl'),
      }),
      isGlobal: true,
    }),
    AuthenticationModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    AppService,
  ],
})
export class AppModule {}
