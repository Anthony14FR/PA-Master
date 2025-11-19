import { StorageService } from "../../../../application/ports/services/storage-service.interface";

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function writeCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

export class CookieStorageService implements StorageService {
  async get<T = unknown>(key: string): Promise<T | undefined> {
    const raw = readCookie(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  }
  async set<T = unknown>(key: string, value: T): Promise<void> {
    writeCookie(key, JSON.stringify(value));
  }
  async remove(key: string): Promise<void> {
    writeCookie(key, "", -1);
  }
}
