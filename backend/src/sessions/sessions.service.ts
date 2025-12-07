import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, masterId: string) {
    return this.prisma.session.create({
      data: {
        userId,
        masterId,
        status: 'ACTIVE',
      },
    });
  }

  async getSession(sessionId: string, requesterId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        master: true,
        tasks: { include: { submissions: true } },
        chatAccess: true,
      },
    });

    if (!session) throw new NotFoundException('Session not found');

    if (session.userId !== requesterId && session.masterId !== requesterId) {
      throw new ForbiddenException('You do not have access to this session');
    }

    return session;
  }

  async getUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      include: {
        master: true,
        tasks: true,
      },
    });
  }

  async getMasterSessions(masterId: string) {
    return this.prisma.session.findMany({
      where: { masterId },
      include: {
        user: true,
        tasks: true,
      },
    });
  }

  async getMasterClients(masterId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { masterId },
      include: { user: true },
    });

    const uniqueUsers = Array.from(
      new Map(sessions.map((s) => [s.user.id, s.user])).values(),
    );

    return uniqueUsers;
  }
}
