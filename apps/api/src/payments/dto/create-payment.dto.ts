import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { PaymentProvider } from '@prisma/client';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsOptional()
  @IsString()
  description?: string;
}
