  import { Injectable } from '@nestjs/common';
  import OpenAI from 'openai';

  interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
  }

  @Injectable()
  export class LlmService {
    private openai: OpenAI;
    private chatHistories: Record<string, ChatMessage[]> = {};

    constructor() {
      this.openai = new OpenAI({
        apiKey: process.env.LLM_TOKEN,
        baseURL: 'https://router.huggingface.co/v1',
      });
    }

    /**
     * Основной метод для интерпретации сна с учётом истории чата
     * и генерацией "чистого текста" без Markdown, списков, кавычек и стрелок
     */
    async interpretDream(chatId: string, message: string): Promise<string> {
      if (!this.chatHistories[chatId]) this.chatHistories[chatId] = [];

      // Сохраняем сообщение пользователя
      this.chatHistories[chatId].push({ role: 'user', text: message });

      try {
        // Формируем массив сообщений для модели
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
- Формат ответа: сначала текст анализа сна с эмодзи (если есть), затем отдельная строка "Совет: ..." с рекомендацией.`

          },
          ...this.chatHistories[chatId].map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        ] as any; // any для обхода типизации OpenAI SDK

        // Отправка запроса в модель
        const response = await this.openai.chat.completions.create({
          model: 'Qwen/Qwen3-4B-Instruct-2507:nscale',
          messages: messagesForLLM,
          temperature: 0.5,
        });

        // Получаем ответ модели
        let answer = response.choices?.[0]?.message?.content || 'Ответ не получен';

        // Очищаем текст от Markdown, кавычек и стрелок
        answer = answer
          .replace(/[*#>]/g, '')    // убираем *, #, >
          .replace(/[-–—]/g, '-')   // приводим тире к обычному
          .replace(/["“”«»]/g, '')  // убираем кавычки
          .trim();

        // Сохраняем ответ модели в истории
        this.chatHistories[chatId].push({ role: 'bot', text: answer });

        return answer;
      } catch (err: any) {
        console.error('Ошибка LLM:', err.message);
        return 'Ошибка при обработке текста';
      }
    }

    /**
     * Получение истории сообщений чата
     */
    getChatHistory(chatId: string): ChatMessage[] {
      return this.chatHistories[chatId] || [];
    }

    /**
     * Очистка истории конкретного чата
     */
    clearChatHistory(chatId: string) {
      this.chatHistories[chatId] = [];
    }
  }
