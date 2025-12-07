import { Injectable } from '@nestjs/common';
import { calculateLevel } from "./rank.utils";
import { PrismaService } from '../prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class RankService {
  constructor(private prisma: PrismaService, private notificationsGateway: NotificationsGateway,) {}

  async addRankPoints(userId: string, amount: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { rankPoints: { increment: points } },
    });

    const newPoints = user.rankPoints + amount;
    const newLevel = calculateLevel(newPoints);
    
	this.notificationsGateway.sendNotification(userId, {
      type: 'rank',
      rank: { points: user.rankPoints, level: user.rankLevel },
      createdAt: new Date().toISOString(),
    });

 //   return this.prisma.user.update({
 //     where: { id: userId },
 //     data: {
 //       rankPoints: newPoints,
  //      rankLevel: newLevel,
 //     },
 //   });
  }
}
