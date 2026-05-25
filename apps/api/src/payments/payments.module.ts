import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe.service';
import { MercadoPagoService } from './mercadopago.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService, MercadoPagoService],
  exports: [PaymentsService, StripeService, MercadoPagoService],
})
export class PaymentsModule {}
