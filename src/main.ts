import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loadConfig } from './common/util/config.util';

async function bootstrap() {
  loadConfig(process.env.NODE_ENV);
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: '*',
  });
  
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted : true,
    transform: true
  }));

  const config = new DocumentBuilder()
    .setTitle('ranterval.API')
    .setDescription('ranterval-back')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 }
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
