-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('FIRST_LOGIN', 'FIRST_COURSE', 'FIRST_LESSON', 'STREAK_7', 'STREAK_30', 'LEVEL_5', 'LEVEL_10', 'CERTIFICATE');

-- CreateTable
CREATE TABLE "gamification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gamification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "gamificationId" TEXT NOT NULL,
    "badge" "BadgeType" NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gamification_userId_key" ON "gamification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_gamificationId_badge_key" ON "user_badges"("gamificationId", "badge");

-- AddForeignKey
ALTER TABLE "gamification" ADD CONSTRAINT "gamification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_gamificationId_fkey" FOREIGN KEY ("gamificationId") REFERENCES "gamification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
