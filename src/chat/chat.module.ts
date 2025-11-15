// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { Message } from '../message/message.entity';
import { AuthModule } from '../auth/auth.module'; // <--- импортируем модуль с AuthService

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message]), AuthModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
