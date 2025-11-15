import { Body, Controller, Post } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller('dreams')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  // Отправка сообщения и получение ответа
  @Post('interpret')
  async interpret(
    @Body() body: { text: string; chatId?: string; authKey: string },
  ) {
    const { text, chatId, authKey } = body;
    return this.llmService.interpretDream(authKey, chatId || null, text);
  }
}
