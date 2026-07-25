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

  const limiter = (max: number, message: string) =>
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max,
      message: { message },
      standardHeaders: true,
      legacyHeaders: false,
    });

  app.use(
    '/auth/validate-credentials',
    limiter(
      10,
      'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.',
    ),
  );
  app.use(
    '/auth/forgot-password',
    limiter(5, 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.'),
  );
  app.use(
    '/auth/reset-password',
    limiter(10, 'Demasiados intentos. Intenta de nuevo en 15 minutos.'),
  );
  app.use(
    '/contact',
    limiter(5, 'Demasiados mensajes enviados. Intenta de nuevo en 15 minutos.'),
  );
  // Un solo límite compartido para todas las acciones bajo /account/*
  // (cambiar contraseña, cambiar email, confirmar email, borrar cuenta):
  // express-rate-limit se monta por prefijo de ruta con app.use, así que un
  // límite por sub-ruta individual también protegería (redundantemente) a
  // sus rutas hermanas anidadas bajo /account — un único límite compartido
  // evita esa duplicación sin perder protección.
  app.use(
    '/account',
    limiter(
      10,
      'Demasiados intentos sobre tu cuenta. Intenta de nuevo en 15 minutos.',
    ),
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
