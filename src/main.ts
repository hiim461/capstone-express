import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from '@fastify/compress';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // await app.register(compression);

  app.enableCors();
  app.use(express.static('.'));

  //swagger
  const config = new DocumentBuilder()
    .setTitle('Capstone express orm')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(8080);
}
bootstrap();
