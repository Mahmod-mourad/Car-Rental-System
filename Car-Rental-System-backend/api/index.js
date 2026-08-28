/**
 * Vercel Serverless entrypoint for the Car Rental API.
 *
 * Mirrors src/main.ts (CORS, validation pipe, swagger) but skips `listen()` —
 * Vercel drives the Express instance per request instead.
 *
 * The global prefix is `api`, matching how the frontend builds its base URL
 * (NEXT_PUBLIC_API_URL = https://<host>/api).
 */
const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { ValidationPipe } = require('@nestjs/common');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const { AppModule } = require('../dist/app.module');

let appPromise = null;

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      const server = express();
      const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

      const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

      app.enableCors({
        origin: corsOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      });

      app.setGlobalPrefix('api');
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
          forbidNonWhitelisted: true,
        }),
      );

      await app.init();

      const config = new DocumentBuilder()
        .setTitle('Car Rental System API')
        .setDescription('API documentation for the Car Rental System')
        .setVersion('1.0')
        .addBearerAuth(
          { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' },
          'JWT-auth',
        )
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document);

      return app;
    })().catch((error) => {
      appPromise = null;
      throw error;
    });
  }
  return appPromise;
}

module.exports = async (req, res) => {
  try {
    const app = await getApp();
    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error) {
    console.error('Serverless handler failed:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};
