import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    .setDescription('REST API documentation for the Real Estate Platform — Auth, Identity, and more.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('App', 'Root & health-check endpoints')
    .addTag('Auth', 'Authentication & identity endpoints')
    .addTag('Audit', 'Audit & observability endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Real Estate API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`\n🚀  Server running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📖  Swagger UI  → http://localhost:${process.env.PORT ?? 3000}/api\n`);
}
bootstrap();
