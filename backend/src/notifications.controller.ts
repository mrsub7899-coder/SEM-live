import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private prisma: PrismaService) {}

  @Get('overview')
  async getOverview(@Req() req) {
    const userId = req.user.id;

    // all sessions for this user (as user or master)
    const sessions = await this.prisma.session.findMany({
      where: {
        OR: [{ userId }, { masterId: userId }],
      },
      select: { id: true },
    });

    const sessionIds = sessions.map((s) => s.id);

    const messagesCount = await this.prisma.sessionMessage.count({
      where: {
        sessionId: { in: sessionIds },
        // naive: count all messages not sent by this user
        NOT: { senderId: userId },
      },
    });

    // tasks for user (user is the session user)
    const tasksCount = await this.prisma.task.count({
      where: {
        session: { userId },
        status: 'PENDING',
      },
    });

    return {
      messages: messagesCount,
      tasks: tasksCount,
    };
  }
}
