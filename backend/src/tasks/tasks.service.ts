import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(
    sessionId: string,
    title: string,
    description: string,
    bounty: number,
  ) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

await this.prisma.task.create({
  data: {
    sessionId,
    session.userId, // REQUIRED
    title,
    description,
    bounty,
    status: 'PENDING',
  },
});
  }

  async stakeTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { session: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.status !== 'PENDING') {
      throw new BadRequestException('Task is not available for staking');
    }

    if (task.session.userId !== userId) {
      throw new BadRequestException('User is not the owner of this session');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.credits < task.bounty) {
      throw new BadRequestException('Not enough credits to stake');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: task.bounty } },
      });

      const submission = await tx.taskSubmission.create({
        data: {
          taskId: task.id,
          userId,
          sessionId: task.sessionId,
          stakeCredits: task.bounty,
        },
      });

      return submission;
    });
  }

  async submitProof(
    taskId: string,
    userId: string,
    proofUrl: string,
    proofType: 'IMAGE' | 'VIDEO',
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { session: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.session.userId !== userId) {
      throw new BadRequestException('User is not the owner of this session');
    }

    const submission = await this.prisma.taskSubmission.findFirst({
      where: {
        taskId,
        userId,
      },
    });

    if (!submission) {
      throw new BadRequestException('User has not staked on this task');
    }

    return this.prisma.taskSubmission.update({
      where: { id: submission.id },
      data: {
        proofUrl,
        proofType,
      },
    });
  }

  async updateStatus(
    taskId: string,
    status: 'COMPLETED' | 'FAILED',
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        session: true,
        submissions: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.status !== 'PENDING') {
      throw new BadRequestException('Task is already resolved');
    }

    if (!task.submissions.length) {
      throw new BadRequestException('No submission found for this task');
    }

    const submission = task.submissions[0];
    const stake = submission.stakeCredits;

    if (status === 'COMPLETED') {
      return this.prisma.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.COMPLETED },
      });
    }

    if (status === 'FAILED') {
      return this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: task.session.masterId },
          data: {
            credits: { increment: stake },
          },
        });

        const updatedTask = await tx.task.update({
          where: { id: taskId },
          data: { status: TaskStatus.FAILED },
        });

        return updatedTask;
      });
    }

    throw new BadRequestException('Invalid status');
  }
async createTemplate(
  masterId: string,
  data: { title: string; description: string; bounty: number },
) {
  return this.prisma.taskTemplate.create({
    data: {
      masterId,
      title: data.title,
      description: data.description,
      bounty: data.bounty,
    },
  });
}

async getMasterTemplates(masterId: string) {
  return this.prisma.taskTemplate.findMany({
    where: { masterId },
    orderBy: { createdAt: 'desc' },
  });
}

}
