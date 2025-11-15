// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LlmModule } from './llm/llm.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { PaymentModule } from './payment/payment.module';

import { User } from './auth/user.entity';
import { Chat } from './chat/chat.entity';
import { Message } from './message/message.entity';

@Module({
  imports: [
    // Подключение к базе через переменную окружения
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // <--- здесь Neon URL
      entities: [User, Chat, Message],
      synchronize: true, // для хакатона/разработки можно оставить
      ssl: {
        rejectUnauthorized: false, // нужно для Neon
      },
      logging: true,
    }),
    LlmModule,
    AuthModule,
    ChatModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
