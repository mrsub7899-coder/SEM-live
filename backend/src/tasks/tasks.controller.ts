import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RankService } from '../rank/rank.service';
import { PrismaService } from '../prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AuthenticatedRequest } from '../types/auth';
import { CreateTaskDto } from './dto/create-task.dto';
import { StakeTaskDto } from './dto/stake-task.dto';
import { SubmitProofDto } from './dto/submit-proof.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private prisma: PrismaService,
    private rankService: RankService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  @Roles('MASTER')
  @Post('create')
  async createTask(@Req() req: AuthenticatedRequest, @Body() body: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        userId: req.user.id,
        title: body.title,
        bounty: body.bounty,
        status: 'PENDING',
      },
    });

    this.notificationsGateway.sendNotification(req.user.id, {
      type: 'task',
      title: task.title,
      createdAt: task.createdAt.toISOString(),
    });

    return task;
  }

  @Roles('USER')
  @Post(':id/stake')
  async stakeTask(@Param('id') taskId: string, @Body() body: StakeTaskDto) {
    return this.tasksService.stakeTask(taskId, body.userId);
  }

  @Roles('USER')
  @Post(':id/proof')
  async submitProof(@Param('id') taskId: string, @Body() body: SubmitProofDto) {
    return this.tasksService.submitProof(
      taskId,
      body.userId,
      body.proofUrl,
      body.proofType,
    );
  }

  @Roles('MASTER')
  @Patch('proofs/:id/approve')
  async approveProof(@Param('id') proofId: string) {
    const proof = await this.prisma.taskProof.update({
      where: { id: proofId },
      data: { status: 'APPROVED' },
      include: { user: true },
    });

    // award RP to user whose proof was approved
    await this.rankService.addRankPoints(proof.userId, 10);

    return { message: 'Proof approved, rank updated.' };
  }

  @Roles('MASTER')
  @Patch(':id/status')
  async updateStatus(@Param('id') taskId: string, @Body() body: UpdateStatusDto) {
    return this.tasksService.updateStatus(taskId, body.status);
  }
}
