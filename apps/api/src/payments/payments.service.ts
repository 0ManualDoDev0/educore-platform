import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(userId: string, dto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        userId,
        amount: dto.amount,
        provider: dto.provider,
        description: dto.description,
        status: 'PENDING',
      },
    });
  }

  async getMyPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
    });
  }

  async createSubscription(userId: string, plan: string, expiresAt: Date) {
    return this.prisma.subscription.upsert({
      where: { userId },
      create: { userId, plan, expiresAt, status: 'ACTIVE' },
      update: { plan, expiresAt, status: 'ACTIVE' },
    });
  }

  async cancelSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub) throw new NotFoundException('Assinatura não encontrada');
    return this.prisma.subscription.update({
      where: { userId },
      data: { status: 'CANCELLED' },
    });
  }
}
