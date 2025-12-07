import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationPayload } from './notification.types';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  handleConnection(socket: any) {
    const userId = socket.handshake.query.userId; // pass userId in frontend connect
    if (userId) {
      socket.join(userId);
    }
  }

  sendNotification(userId: string, payload: NotificationPayload) {
    this.server.to(userId).emit('notification', payload);
  }
}
