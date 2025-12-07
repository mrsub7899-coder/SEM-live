import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { AuthenticatedRequest } from '../types/auth';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('overview')
  async getOverview(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.getOverview(req.user.id);
  }
}
