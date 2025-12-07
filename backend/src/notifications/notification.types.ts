export type NotificationType = 'message' | 'task' | 'session' | 'rank';

export interface NotificationPayload {
  type: NotificationType;
  text?: string; // for messages
  title?: string; // for tasks
  sessionId?: string; // for sessions
  master?: { id: string; name?: string; email?: string };
  user?: { id: string; name?: string; email?: string };
  rank?: { points: number; level: number }; // for rank updates
  createdAt?: string;
}
