import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis-module';
import { googleStrategy } from 'src/auth/jwt-oauth-strategy';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService,googleStrategy],
})
export class UsersModule {}
