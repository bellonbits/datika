import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { json, raw } from 'express';
import type { Request, Response } from 'express';
import type { IncomingMessage } from 'http';
import { AppModule } from '../src/app.module';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express') as typeof import('express');

const server = express();

// Root health check
server.get('/', (_req, res) => {
  res.json({ status: 'ok', name: 'Datika API', version: '1.0.0', docs: '/api/docs' });
});

let isReady = false;

async function bootstrap() {
  if (isReady) return server;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    bodyParser: false,
    logger: ['error', 'warn', 'log'],
  });

  const config = app.get(ConfigService);
  const frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:3000');

  app.setGlobalPrefix('api/v1');

  app.use('/api/v1/payments/webhook', raw({ type: '*/*' }));

  app.use(
    json({
      verify: (req: IncomingMessage & { rawBody?: Buffer }, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowed = [
        frontendUrl,
        'http://localhost:3000',
        'http://localhost:3001',
      ];
      // Allow all Vercel deployment URLs for the datika project
      if (!origin || allowed.includes(origin) || /^https:\/\/datika[^.]*\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-lipana-signature'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.init();
  isReady = true;
  return server;
}

export default async (req: Request, res: Response) => {
  await bootstrap();
  server(req, res);
};
