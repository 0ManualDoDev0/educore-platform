import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(@Body() dto: CreatePaymentDto, @CurrentUser() user: any) {
    return this.paymentsService.createPayment(user.id, dto);
  }

  @Get()
  getMyPayments(@CurrentUser() user: any) {
    return this.paymentsService.getMyPayments(user.id);
  }

  @Get('subscription')
  getSubscription(@CurrentUser() user: any) {
    return this.paymentsService.getSubscription(user.id);
  }

  @Delete('subscription')
  cancelSubscription(@CurrentUser() user: any) {
    return this.paymentsService.cancelSubscription(user.id);
  }
}
