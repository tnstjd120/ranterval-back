import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisModule } from 'src/redis/redis-module';
import { googleStrategy } from 'src/auth/jwt-oauth-strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    RedisModule,
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService,googleStrategy],
})
export class UsersModule {}
