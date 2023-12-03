import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import { urlencoded, json } from 'express';
import { NestApplication } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    logger: ['log', 'error', 'warn'],
    cors: {
      origin: '*',
    },
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
