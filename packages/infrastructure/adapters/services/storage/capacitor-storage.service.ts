import { StorageService } from "../../../../application/ports/services/storage-service.interface";

export class CapacitorStorageService implements StorageService {
  async get<T = unknown>(key: string): Promise<T | undefined> {
    try {
      // Try to use Capacitor Storage plugin if available at runtime
      // Avoid direct import to keep this module optional; use globalThis as a guard
      // @ts-ignore
      const globalAny: any = globalThis as any;
      if (
        globalAny.Capacitor &&
        globalAny.Capacitor.Plugins &&
        globalAny.Capacitor.Plugins.Storage
      ) {
        const { value } = await globalAny.Capacitor.Plugins.Storage.get({
          key,
        });
        return value ? (JSON.parse(value) as T) : undefined;
      }
      // Fallback: in web, localStorage may be available
      const raw =
        typeof localStorage !== "undefined"
          ? localStorage.getItem(key)
          : undefined;
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch (err) {
      throw err;
    }
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    // @ts-ignore
    const globalAny: any = globalThis as any;
    if (
      globalAny.Capacitor &&
      globalAny.Capacitor.Plugins &&
      globalAny.Capacitor.Plugins.Storage
    ) {
      await globalAny.Capacitor.Plugins.Storage.set({
        key,
        value: JSON.stringify(value),
      });
      return;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }
    throw new Error("No storage available");
  }

  async remove(key: string): Promise<void> {
    // @ts-ignore
    const globalAny: any = globalThis as any;
    if (
      globalAny.Capacitor &&
      globalAny.Capacitor.Plugins &&
      globalAny.Capacitor.Plugins.Storage
    ) {
      await globalAny.Capacitor.Plugins.Storage.remove({ key });
      return;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
      return;
    }
    throw new Error("No storage available");
  }
}
