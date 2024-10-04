import { Module } from '@nestjs/common';
import { loadConfig } from './common/util/config.util';
import { googleStrategy } from './auth/jwt-oauth-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis-module';


loadConfig(process.env.NODE_ENV);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '3306'), 
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DBNAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      extra: {
        supportBigNumbers: true,
        bigNumberStrings: false,
      },
      timezone: 'Asia/Seoul',
    }),
    UsersModule,
    RedisModule,
    AuthModule],
  controllers: [],
  providers: [
    UsersService,
    googleStrategy
  ],
})
export class AppModule {}