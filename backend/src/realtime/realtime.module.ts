import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { SessionChatGateway } from "../sessions/session-chat.gateway";
import { PresenceGateway } from "../presence/presence.gateway";

@Module({
  providers: [PrismaService, SessionChatGateway, PresenceGateway],
})
export class RealtimeModule {}
