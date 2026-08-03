import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { JsonLogger } from '../src/common/json-logger.service';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: express.Express;

async function bootstrapServer(): Promise<express.Express> {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: new JsonLogger() }
    );

    app.enableCors({
      origin: true,
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization, x-session-id, X-Requested-With',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Swagger / OpenAPI setup
    const config = new DocumentBuilder()
      .setTitle('AI-Native Real Estate Platform')
      .setDescription('REST API documentation')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document); // using /docs on vercel so it doesn't conflict with /api

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  return server(req, res);
};
