import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // без .js

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept',
  });
 await app.listen(process.env.PORT ?? 8000);
 
}
bootstrap();
