import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.gamificationService.getProfile(user.id);
  }

  @Get('ranking')
  getRanking() {
    return this.gamificationService.getRanking();
  }

  @Post('xp')
  addXp(@CurrentUser() user: any, @Body() body: { xp: number }) {
    return this.gamificationService.addXp(user.id, body.xp);
  }

  @Post('streak')
  updateStreak(@CurrentUser() user: any) {
    return this.gamificationService.updateStreak(user.id);
  }
}
