import { Controller, Get, Post, Body, Param, Req, UseGuards,} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AuthenticatedRequest } from '../types/auth';

@Controller('sessions')
@UseGuards(AuthGuard('jwt'))
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService, private prisma: PrismaService, private notificationsGateway: NotificationsGateway,) {}

  @Roles('MASTER')
  @Post()
  async createSession(
    @Req() req: AuthenticatedRequest,
    @Body() body: { masterId: string },
  ) {
    const session = await this.prisma.session.create({
      data: {
        userId: req.user.id,
        masterId: body.masterId,
      },
      include: { master: true, user: true },
    });

    // Emit notification to both user and master
    this.notificationsGateway.sendNotification(req.user.id, {
      type: 'session',
      sessionId: session.id,
      master: session.master,
      user: session.user,
      createdAt: session.createdAt.toISOString(),
    });

    this.notificationsGateway.sendNotification(body.masterId, {
      type: 'session',
      sessionId: session.id,
      master: session.master,
      user: session.user,
      createdAt: session.createdAt.toISOString(),
    });

    return session;
  }

  @Get(':id')
  async getSession(@Param('id') id: string, @Req() req) {
    return this.sessionsService.getSession(id, req.user.id);
  }

  @Roles('USER')
  @Get('user/my-sessions')
  async getUserSessions(@Req() req) {
    return this.sessionsService.getUserSessions(req.user.id);
  }

  @Roles('MASTER')
  @Get('master/my-sessions')
  async getMasterSessions(@Req() req) {
    return this.sessionsService.getMasterSessions(req.user.id);
  }

  @Roles('MASTER')
  @Get('master/clients')
  async getMasterClients(@Req() req) {
    return this.sessionsService.getMasterClients(req.user.id);
  }
}
