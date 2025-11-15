// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  // Создание нового чата для пользователя
  async createChat(user: User, firstMessage?: string): Promise<Chat> {
    const title = firstMessage
      ? firstMessage.split(' ').slice(0, 3).join(' ')
      : `Чат ${Date.now()}`;

    const chat = this.chatRepository.create({
      user,
      title,
    });

    return this.chatRepository.save(chat);
  }

  // Получение всех чатов пользователя
  async getUserChats(user: User): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { user: { id: user.id } },
      relations: ['messages'],
      order: { createdAt: 'DESC' },
    });
  }
}
