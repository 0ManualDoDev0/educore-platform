import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AiModule } from './ai/ai.module';
import { PaymentsModule } from './payments/payments.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    AiModule,
    PaymentsModule,
    GamificationModule,
  ],
})
export class AppModule {}
