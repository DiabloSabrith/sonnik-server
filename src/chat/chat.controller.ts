  // src/chat/chat.controller.ts
  import { Controller, Post, Get, Body, Query } from '@nestjs/common';
  import { ChatService } from './chat.service';
  import { AuthService } from '../auth/auth.service';
  import { Chat } from './chat.entity';

  @Controller('chat')
  export class ChatController {
    constructor(
      private chatService: ChatService,
      private authService: AuthService,
    ) {}

    // Создать новый чат для пользователя
    @Post('create')
    async createChat(
      @Query('authKey') authKey: string,
      @Body('firstMessage') firstMessage?: string,
    ): Promise<Chat> {
      const user = await this.authService.findByAuthKey(authKey);
      if (!user) throw new Error('User not found');

      return this.chatService.createChat(user, firstMessage);
    }

    // Получить все чаты пользователя
    @Get('list')
    async getChats(@Query('authKey') authKey: string): Promise<Chat[]> {
      const user = await this.authService.findByAuthKey(authKey);
      if (!user) throw new Error('User not found');

      return this.chatService.getUserChats(user);
    }
  }
