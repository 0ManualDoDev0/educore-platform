import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || '',
    });
  }

  async createPreference(params: {
    userId: string;
    plan: string;
    amount: number;
    successUrl: string;
    failureUrl: string;
  }) {
    const preference = new Preference(this.client);
    const response = await preference.create({
      body: {
        items: [
          {
            id: params.plan,
            title: `EduCore — Plano ${params.plan}`,
            quantity: 1,
            unit_price: params.amount,
            currency_id: 'BRL',
          },
        ],
        metadata: { userId: params.userId, plan: params.plan },
        back_urls: {
          success: params.successUrl,
          failure: params.failureUrl,
          pending: params.failureUrl,
        },
        auto_return: 'approved',
      },
    });
    return { url: response.init_point, preferenceId: response.id };
  }
}
