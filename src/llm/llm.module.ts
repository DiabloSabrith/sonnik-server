import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { Chat } from '../chat/chat.entity';
import { Message } from '../message/message.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message, User]), // 🔥 обязательно для репозиториев
  ],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService], // если планируешь использовать сервис в других модулях
})
export class LlmModule {}
