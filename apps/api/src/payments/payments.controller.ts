import { Controller, Get, Post, Delete, Body, UseGuards, RawBodyRequest, Req, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createPayment(@Body() dto: CreatePaymentDto, @CurrentUser() user: any) {
    return this.paymentsService.createPayment(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyPayments(@CurrentUser() user: any) {
    return this.paymentsService.getMyPayments(user.id);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  getSubscription(@CurrentUser() user: any) {
    return this.paymentsService.getSubscription(user.id);
  }

  @Delete('subscription')
  @UseGuards(JwtAuthGuard)
  cancelSubscription(@CurrentUser() user: any) {
    return this.paymentsService.cancelSubscription(user.id);
  }

  @Post('checkout/stripe')
  @UseGuards(JwtAuthGuard)
  createStripeCheckout(@CurrentUser() user: any, @Body() body: { plan: string; amount: number }) {
    return this.stripeService.createCheckoutSession({
      userId: user.id,
      plan: body.plan,
      amount: body.amount,
      successUrl: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancelUrl: `${process.env.FRONTEND_URL}/dashboard?payment=cancelled`,
    });
  }

  @Post('webhook/stripe')
  async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
    const event = await this.stripeService.constructWebhookEvent(req.rawBody, sig);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      await this.paymentsService.createSubscription(session.metadata.userId, session.metadata.plan, expiresAt);
    }

    return { received: true };
  }
}
