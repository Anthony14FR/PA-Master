import {
  NotificationService,
  NotificationPayload,
} from "../../../../application/ports/services/notification-service.interface";

export class CapacitorNotificationService implements NotificationService {
  async send(payload: NotificationPayload): Promise<void> {
    try {
      const globalAny: any = globalThis as any;
      if (globalAny.Capacitor && globalAny.Capacitor.PushNotifications) {
        // Note: actual push sending requires server-side push; this is a local stub
        console.log("[CapacitorPush] register/send stub", payload);
      } else {
        console.log("[CapacitorPush] not available, fallback log", payload);
      }
    } catch (err) {
      console.error("[CapacitorPush] error", err);
      throw err;
    }
  }
}
