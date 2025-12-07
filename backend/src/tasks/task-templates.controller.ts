import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { TasksService } from './tasks.service';

@Controller('task-templates')
@UseGuards(AuthGuard('jwt'))
export class TaskTemplatesController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles('MASTER')
  @Post()
  createTemplate(
    @Req() req,
    @Body() body: { title: string; description: string; bounty: number },
  ) {
    return this.tasksService.createTemplate(req.user.id, body);
  }

  @Roles('MASTER')
  @Get('mine')
  getMyTemplates(@Req() req) {
    return this.tasksService.getMasterTemplates(req.user.id);
  }
}
