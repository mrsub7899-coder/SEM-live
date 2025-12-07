import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Fetch recent messages, tasks, sessions, and rank progress for a user
   */
  async getOverview(userId: string) {
    // Recent global chat messages
    const messages = await this.prisma.globalChatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Recent tasks assigned to the user
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Recent sessions involving the user (as client or master)
    const sessions = await this.prisma.session.findMany({
      where: {
        OR: [{ userId }, { masterId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        master: { select: { id: true, name: true, email: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Current rank progress
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        rankPoints: true,
        rankLevel: true,
      },
    });

    return {
      messages,
      tasks,
      sessions,
      rank: {
        points: user?.rankPoints ?? 0,
        level: user?.rankLevel ?? 0,
      },
    };
  }
}
