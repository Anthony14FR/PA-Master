import { LoggerService } from "../../../../application/ports/services/logger-service.interface";

export class ConsoleLoggerService implements LoggerService {
  info(message: string, meta?: Record<string, unknown>): void {
    console.info("[INFO]", message, meta ?? {});
  }
  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn("[WARN]", message, meta ?? {});
  }
  error(message: string, meta?: Record<string, unknown>): void {
    console.error("[ERROR]", message, meta ?? {});
  }
}
