import { StorageService } from "../../../../application/ports/services/storage-service.interface";

export class SessionStorageService implements StorageService {
  async get<T = unknown>(key: string): Promise<T | undefined> {
    const raw =
      typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem(key)
        : undefined;
    return raw ? (JSON.parse(raw) as T) : undefined;
  }
  async set<T = unknown>(key: string, value: T): Promise<void> {
    if (typeof sessionStorage === "undefined")
      throw new Error("sessionStorage not available");
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  async remove(key: string): Promise<void> {
    if (typeof sessionStorage === "undefined")
      throw new Error("sessionStorage not available");
    sessionStorage.removeItem(key);
  }
}
