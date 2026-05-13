import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from 'pino';
import pinoHttp from 'pino-http';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger: new Logger({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }),
  });

  // Security
  app.use(helmet());

  // Logging
  app.use(
    pinoHttp({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  // Global pipes & filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['*'],
    credentials: true,
  });

  const port = parseInt(process.env.PORT || '3002', 10);
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  logger.info(`🎓 SIS Service listening on http://${host}:${port}`);
  logger.info(`📚 GraphQL: http://${host}:${port}/graphql`);
}

bootstrap().catch((err) => {
  console.error('Failed to start SIS service:', err);
  process.exit(1);
});
