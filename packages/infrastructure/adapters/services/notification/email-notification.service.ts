import {
  NotificationService,
  NotificationPayload,
} from "../../../../application/ports/services/notification-service.interface";
import { HttpClient } from "../../../../application/ports/http/http-client.interface";
import { LoggerService } from "../../../../application/ports/services/logger-service.interface";

export class EmailNotificationService implements NotificationService {
  constructor(
    private readonly api?: HttpClient,
    private readonly logger?: LoggerService,
    private readonly apiBase?: string
  ) {}

  async send(payload: NotificationPayload): Promise<void> {
    if (this.api) {
      try {
        await this.api.post("/send-email", payload);
        this.logger?.info("notification.email.sent", { to: payload.to });
        return;
      } catch (err) {
        this.logger?.warn("EmailNotification: api.post failed, falling back", {
          err,
        });
      }
    }

    if (this.apiBase) {
      try {
        await fetch(new URL("/api/send-email", this.apiBase).toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        this.logger?.info("notification.email.sent.fallback", {
          to: payload.to,
        });
        return;
      } catch (err) {
        this.logger?.warn("EmailNotification: fetch fallback failed", { err });
      }
    }

    if (this.logger) {
      this.logger.info("notification.email.fallback.log", { payload });
    } else {
      console.log("[EMAIL] fallback send", payload);
    }
  }
}
