import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const redisClientFactory = {
  provide: 'REDIS_CLIENT',
  useFactory: async (configService: ConfigService) => {
    const redisHost = configService.get<string>('REDIS_URL', '127.0.0.1');
    const redisPort = configService.get<number>('REDIS_PORT', 6379);
    
    const redisClient = await getClient(redisHost, redisPort);
    return redisClient;
  },
  inject: [ConfigService],
};

export async function getClient(redisHost: string, redisPort: number) {
    const logger: Logger = new Logger('REDIS CLIENT');
    const client = createClient({
      url: `redis://${redisHost}:${redisPort}`
    });

  client.on('error', (error) => logger.error({ error }));

  await client.connect();

  return client;
}