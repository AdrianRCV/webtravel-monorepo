import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const { default: helmet } = await import('helmet');
  app.use(helmet());

  const { default: rateLimit } = await import('express-rate-limit');
  app.use(
    '/auth/validate-credentials',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      message: {
        message:
          'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
