import { Module } from '@nestjs/common';
import { loadConfig } from './common/util/config.util';
import { googleStrategy } from './auth/jwt-oauth-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
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
      }
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    RedisModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),],
  controllers: [UsersController],
  providers: [
    UsersService,
    googleStrategy
  ],
})
export class AppModule {}