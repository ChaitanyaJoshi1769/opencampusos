import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new HttpException(
          {
            status: 'error',
            statusCode: 400,
            message: 'Validation failed',
            errors: messages,
          },
          400,
        );
      },
    }),
  );

  const port = process.env.PORT || 3014;
  await app.listen(port, () => {
    console.log(`🚀 Reports Service running on port ${port}`);
  });
}

bootstrap();
