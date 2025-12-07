import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TaskTemplatesController } from './task-templates.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TasksController, TaskTemplatesController],
  providers: [TasksService, PrismaService],
  exports: [TasksService],
})
export class TasksModule {}