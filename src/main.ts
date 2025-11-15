import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Разрешаем локальный фронт + Vercel фронт
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://sonnik-phi.vercel.app',
      'https://sonnik-pro-ai.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
