import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma.service";
import { ForbiddenException } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "*", // tighten in prod
  },
})
export class SessionChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  private async ensureChatRights(sessionId: string, userId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new ForbiddenException("Session not found");

    const isParticipant =
      session.userId === userId || session.masterId === userId;

    if (isParticipant) return;

    // Check paid chat access as extra condition
    const chatAccess = await this.prisma.chatAccess.findFirst({
      where: {
        userId,
        masterId: session.masterId,
      },
    });

    if (!chatAccess) {
      throw new ForbiddenException(
        "You must buy chat access to speak to this master"
      );
    }
  }

  @SubscribeMessage("joinSession")
  async joinSession(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { sessionId, userId } = data;

    if (!sessionId || !userId) return;

    await this.ensureChatRights(sessionId, userId);

    client.join(`session-${sessionId}`);
  }

  @SubscribeMessage("sessionMessage")
  async handleMessage(
    @MessageBody()
    data: { sessionId: string; senderId: string; text: string }
  ) {
    const { sessionId, senderId, text } = data;

    if (!sessionId || !senderId || !text?.trim()) return;

    await this.ensureChatRights(sessionId, senderId);

    const msg = await this.prisma.sessionMessage.create({
      data: {
        sessionId,
        senderId,
        text,
      },
      include: { sender: true },
    });

    this.server.to(`session-${sessionId}`).emit("sessionMessage", msg);
  }
}
