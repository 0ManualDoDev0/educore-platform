import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeType } from '@prisma/client';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getOrCreate(userId: string) {
    return this.prisma.gamification.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { badges: true },
    });
  }

  async addXp(userId: string, xp: number) {
    const gami = await this.getOrCreate(userId);
    const newXp = gami.xp + xp;
    const newLevel = Math.floor(newXp / 100) + 1;

    const updated = await this.prisma.gamification.update({
      where: { userId },
      data: { xp: newXp, level: newLevel },
      include: { badges: true },
    });

    if (newLevel >= 5 && gami.level < 5) await this.awardBadge(userId, 'LEVEL_5');
    if (newLevel >= 10 && gami.level < 10) await this.awardBadge(userId, 'LEVEL_10');
    return updated;
  }

  async updateStreak(userId: string) {
    const gami = await this.getOrCreate(userId);
    const now = new Date();
    const last = gami.lastLogin ? new Date(gami.lastLogin) : null;
    const diffDays = last ? Math.floor((now.getTime() - last.getTime()) / 86400000) : null;

    let newStreak = 1;
    if (diffDays === 1) newStreak = gami.streak + 1;
    else if (diffDays === 0) newStreak = gami.streak;

    await this.prisma.gamification.update({
      where: { userId },
      data: { streak: newStreak, lastLogin: now },
    });

    if (newStreak >= 7) await this.awardBadge(userId, 'STREAK_7');
    if (newStreak >= 30) await this.awardBadge(userId, 'STREAK_30');
    return newStreak;
  }

  async awardBadge(userId: string, badge: BadgeType) {
    const gami = await this.getOrCreate(userId);
    try {
      await this.prisma.userBadge.create({
        data: { gamificationId: gami.id, badge },
      });
    } catch {}
  }

  async getProfile(userId: string) {
    return this.getOrCreate(userId);
  }

  async getRanking() {
    return this.prisma.gamification.findMany({
      orderBy: { xp: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        badges: true,
      },
    });
  }
}
