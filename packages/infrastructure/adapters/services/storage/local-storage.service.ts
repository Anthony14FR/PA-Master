import { StorageService } from "../../../../application/ports/services/storage-service.interface";

export class LocalStorageService implements StorageService {
  async get<T = unknown>(key: string): Promise<T | undefined> {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(key)
        : undefined;
    return raw ? (JSON.parse(raw) as T) : undefined;
  }
  async set<T = unknown>(key: string, value: T): Promise<void> {
    if (typeof localStorage === "undefined")
      throw new Error("localStorage not available");
    localStorage.setItem(key, JSON.stringify(value));
  }
  async remove(key: string): Promise<void> {
    if (typeof localStorage === "undefined")
      throw new Error("localStorage not available");
    localStorage.removeItem(key);
  }
}
