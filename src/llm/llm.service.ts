import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat/chat.entity';
import { Message, MessageSender } from '../message/message.entity';
import { User } from '../auth/user.entity';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  // временное хранение истории для LLM
  private chatHistories: Record<string, { role: 'user' | 'bot'; text: string }[]> = {};
  private openai: OpenAI;

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.LLM_TOKEN,
      baseURL: 'https://router.huggingface.co/v1',
    });
  }

  /**
   * Основной метод обработки сообщения
   */
  async interpretDream(
    userAuthKey: string,
    chatId: string | null,
    text: string
  ): Promise<{ answer: string; chatId: string }> {
    // ------------------------
    // Получаем пользователя
    // ------------------------
    const user = await this.userRepo.findOne({ where: { authKey: userAuthKey } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    // ------------------------
    // Находим или создаем чат
    // ------------------------
    let chat: Chat;

    if (!chatId) {
      chat = this.chatRepo.create({ title: `Чат ${Date.now()}`, user });
      await this.chatRepo.save(chat);
      chatId = chat.id.toString();
    } else {
      chat = await this.chatRepo.findOne({
        where: { id: +chatId, user: { id: user.id } },
      }) ?? this.chatRepo.create({ title: `Чат ${Date.now()}`, user });

      // если чат был создан новый, сохраняем
      if (!chat.id) {
        await this.chatRepo.save(chat);
      }

      chatId = chat.id.toString();
    }

    // ------------------------
    // Сохраняем сообщение пользователя
    // ------------------------
    const userMsg = this.messageRepo.create({
      text,
      sender: MessageSender.USER,
      chat,
    });
    await this.messageRepo.save(userMsg);

    // ------------------------
    // Сохраняем в память для LLM
    // ------------------------
    if (!this.chatHistories[chatId]) this.chatHistories[chatId] = [];
    this.chatHistories[chatId].push({ role: 'user', text });

    // ------------------------
    // Подготовка сообщений для LLM
    // ------------------------
    const messagesForLLM = [
      {
      role: 'system',
content: `Ты — опытный психолог с многолетней практикой, анализирующий сны пользователей.
Твоя задача:
- Давать чёткий и понятный психологический разбор сна с точки зрения психологии, психоанализа и эмоций.
- Иногда, но не всегда, добавляй один или два уместных эмодзи/стикера, чтобы текст был эмоционально окрашен, но не перегружен.
- В конце анализа давай отдельный короткий практический совет, который может помочь пользователю справиться с эмоциями, понять себя или улучшить сон.
- Отвечать простым языком, без сложных терминов, списков, заголовков, кавычек и стрелок.
- Не использовать мистику, предсказания или эзотерику.
- Всегда проявлять эмпатию, заботу и понимание.
- Держать ответы короткими и информативными (но не сухими).
- Учитывать контекст предыдущих сообщений в этом чате, чтобы ответы были связными.
- Формат ответа: сначала текст анализа сна (если есть), затем отдельная строка "Совет: ..." с рекомендацией.
- Также можешь в конце добавлять один уместный смайлик `,
      },
      ...this.chatHistories[chatId].map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ] as any;

    // ------------------------
    // Запрос к LLM
    // ------------------------
    let answer = 'Ответ ИИ не получен';
    try {
      const response = await this.openai.chat.completions.create({
        model: 'Qwen/Qwen3-4B-Instruct-2507:nscale',
        messages: messagesForLLM,
        temperature: 0.5,
      });

      answer = response.choices?.[0]?.message?.content || answer;
      // убираем лишние символы
      answer = answer.replace(/[*#>]/g, '').replace(/[-–—]/g, '-').replace(/["“”«»]/g, '').trim();
    } catch (err: any) {
      console.error('Ошибка LLM:', err.message);
    }

    // ------------------------
    // Сохраняем ответ ИИ
    // ------------------------
    const botMsg = this.messageRepo.create({
      text: answer,
      sender: MessageSender.AI,
      chat,
    });
    await this.messageRepo.save(botMsg);

    // ------------------------
    // Обновляем память
    // ------------------------
    this.chatHistories[chatId].push({ role: 'bot', text: answer });

    return { answer, chatId };
  }
}
