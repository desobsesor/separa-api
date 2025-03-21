import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './infrastructure/logger/logger.service';
import { timezoneConfig } from './infrastructure/config/timezone.config';

async function bootstrap() {

  process.env.TZ = timezoneConfig.timezone;

  const logger = new LoggerService();
  logger.setContext('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://192.168.101.73:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Separa API')
    .setDescription('API documentation for Separa reservation system')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('blocks', 'Reservation blocks management endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api`);
}
bootstrap();
