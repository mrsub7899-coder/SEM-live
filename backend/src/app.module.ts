import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { ChatAccessModule } from './chat-access/chat-access.module';
import { RealtimeModule } from "./realtime/realtime.module";
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [AuthModule, SessionsModule, TasksModule, ChatAccessModule,RealtimeModule,NotificationsController,NotificationsModule],
  providers: [
    PrismaService,
	NotificationsService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
