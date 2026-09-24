import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments/payments.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule, {
    rawBody: true
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform : true,
    whitelist : true,
    forbidNonWhitelisted : true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
