import type { ServerStorageService } from "@kennelo/application/ports/services/server-storage-service.interface";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export class NextCookieStorage implements ServerStorageService {
  constructor(
    private cookies: {
      get: (name: string) => { value: string } | undefined;
      set: (name: string, value: string, options?: Partial<ResponseCookie>) => void;
      delete: (name: string) => void;
    },
    private options?: Partial<ResponseCookie>
  ) {}

  get<T = unknown>(key: string): T | undefined {
    const cookie = this.cookies.get(key);
    if (!cookie) return undefined;

    try {
      return JSON.parse(cookie.value) as T;
    } catch {
      return cookie.value as T;
    }
  }

  set<T = unknown>(key: string, value: T): void {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    this.cookies.set(key, stringValue, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      ...this.options,
    });
  }

  remove(key: string): void {
    this.cookies.delete(key);
  }
}
