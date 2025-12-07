import { Module } from '@nestjs/common';
import { ChatAccessController } from './chat-access.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ChatAccessController],
  providers: [PrismaService],
})
export class ChatAccessModule {}
