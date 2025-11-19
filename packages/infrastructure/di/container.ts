export class AppContainer {
  private services = new Map<symbol | string, any>();
  private factories = new Map<symbol | string, () => any>();

  register<T>(token: symbol | string, instance: T): void {
    this.services.set(token, instance);
  }

  registerFactory<T>(token: symbol | string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  resolve<T>(token: symbol | string): T {
    if (this.services.has(token)) {
      return this.services.get(token) as T;
    }

    if (this.factories.has(token)) {
      const factory = this.factories.get(token)!;
      const instance = factory();
      this.services.set(token, instance);
      return instance as T;
    }

    throw new Error(`Service not registered: ${String(token)}`);
  }

  has(token: symbol | string): boolean {
    return this.services.has(token) || this.factories.has(token);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}
