import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: InstanceType<typeof Stripe>;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  async createCheckoutSession(params: {
    userId: string;
    plan: string;
    amount: number;
    successUrl: string;
    cancelUrl: string;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: `EduCore — Plano ${params.plan}` },
            unit_amount: Math.round(params.amount * 100),
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: { userId: params.userId, plan: params.plan },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    });

    return { url: session.url, sessionId: session.id };
  }

  async constructWebhookEvent(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  }
}
