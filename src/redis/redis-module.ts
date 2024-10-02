import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis-client.factory';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [redisClientFactory],
  exports: [redisClientFactory],
})
export class RedisModule {}