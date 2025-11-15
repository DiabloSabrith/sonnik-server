import { Body, Controller, Post } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller('dreams')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('interpret')
  async interpret(@Body() body: { text: string; chatId?: string }) {
    console.log('Пришёл текст с клиента:', body.text);
    
    // Используем chatId из body или дефолтный "main"
    const chatId = body.chatId || 'main';

    // Вызываем метод с chatId и текстом
    const response = await this.llmService.interpretDream(chatId, body.text);

    return { response };
  }
}
