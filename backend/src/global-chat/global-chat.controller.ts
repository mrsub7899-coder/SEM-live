import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AuthenticatedRequest } from '../types/auth';
import { SendMessageDto } from './dto/send-message.dto';
import { ThreadDto } from './dto/thread.dto';

@Controller('global-chat')
@UseGuards(AuthGuard('jwt'))
export class GlobalChatController {
  constructor(private prisma: PrismaService, private notificationsGateway: NotificationsGateway,) {}

  async ensureRights(userId: string, masterId: string) {
    const access = await this.prisma.chatAccess.findFirst({
      where: { userId, masterId },
    });

    if (!access) {
      throw new ForbiddenException("You must buy chat access first");
    }
  }

  @Post('inbox')
  async inbox(@Req() req: AuthenticatedRequest) {
    return this.prisma.globalChatMessage.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('send')
  async sendMessage(@Req() req: AuthenticatedRequest, @Body() body: SendMessageDto) {
    const msg = await this.prisma.globalChatMessage.create({
      data: { userId: req.user.id, masterId: body.masterId, text: body.text },
    });

    this.notificationsGateway.sendNotification(req.user.id, {
      type: 'message',
      text: msg.text,
      createdAt: msg.createdAt.toISOString(),
    });

    return msg;
  }

  @Post('thread')
  async thread(@Req() req: AuthenticatedRequest, @Body() body: ThreadDto) {
    return this.prisma.globalChatMessage.findMany({
      where: { userId: req.user.id, masterId: body.masterId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
