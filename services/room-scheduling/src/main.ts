import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN || '*' });
  await app.listen(process.env.PORT || 3029);
  console.log(`Room Scheduling Service listening on port ${process.env.PORT || 3029}`);
}
bootstrap();
