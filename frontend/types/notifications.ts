export type NotificationType = 'message' | 'task' | 'session' | 'rank';

export interface NotificationPayload {
  type: NotificationType;
  text?: string;
  title?: string;
  sessionId?: string;
  master?: { id: string; name?: string; email?: string };
  user?: { id: string; name?: string; email?: string };
  rank?: { points: number; level: number };
  createdAt?: string;
}
