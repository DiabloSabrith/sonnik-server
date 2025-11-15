import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
private readonly login = 'oderzhdaru'; // Твой идентификатор
  private readonly password1 = 'ZSns6uhZNtp14OG26KYw'; // Пароль #1
  private readonly password2 = 'GGwFn6ZSJ5Pr9F9NRly3'; // Пароль #2
  private readonly roboPayUrl = 'https://auth.robokassa.ru/Merchant/Index.aspx';

  /** Генерируем ссылку на оплату */
  generatePaymentUrl(amount: number) {
    const orderId = Math.floor(Math.random() * 1000000); // любой уникальный ID для теста

    const signature = crypto
      .createHash('md5')
      .update(`${this.login}:${amount}:${orderId}:${this.password1}`)
      .digest('hex');

    return `${this.roboPayUrl}?MerchantLogin=${this.login}&OutSum=${amount}&InvId=${orderId}&SignatureValue=${signature}&IsTest=1`;
  }

  /** Проверка callback */
  validateCallback(outSum: string, invId: string, signature: string) {
    const mySig = crypto
      .createHash('md5')
      .update(`${outSum}:${invId}:${this.password2}`)
      .digest('hex')
      .toUpperCase();

    return mySig === signature.toUpperCase();
  }
}
