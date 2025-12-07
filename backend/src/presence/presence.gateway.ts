import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (!userId) return;

    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });

    this.server.emit("presenceUpdate", {
      userId,
      isOnline: true,
    });
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (!userId) return;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isOnline: false,
        lastSeen: new Date(),
      },
    });

    this.server.emit("presenceUpdate", {
      userId,
      isOnline: false,
    });
  }
}
