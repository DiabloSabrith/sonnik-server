import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /** Генерируем ссылку и сразу редиректим */
  @Get('create')
  async createPayment(
    @Query('amount') amount: number,
    @Res() res: Response, // используем Express Response
  ) {
    if (!amount || amount <= 0) {
      res.status(400).send('Invalid amount');
      return; // обязательно выйти после отправки ответа
    }

    const url = this.paymentService.generatePaymentUrl(amount);
    res.redirect(url); // редиректим пользователя на RoboKassa
  }

  /** Callback от RoboKassa */
  @Get('success')
  success(
    @Query('OutSum') outSum: string,
    @Query('InvId') invId: string,
    @Query('SignatureValue') signature: string,
  ) {
    const isValid = this.paymentService.validateCallback(outSum, invId, signature);

    if (!isValid) return 'Invalid signature';

    return `OK${invId}`;
  }
}
