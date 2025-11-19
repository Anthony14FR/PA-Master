export type NotificationPayload = {
  to: string;
  title?: string;
  body: string;
  data?: Record<string, unknown>;
};

export interface NotificationService {
  send(payload: NotificationPayload): Promise<void>;
}
