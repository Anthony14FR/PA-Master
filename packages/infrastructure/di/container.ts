type ServiceKey = symbol | string | Function;

export class AppContainer {
  private services = new Map<ServiceKey, any>();
  private factories = new Map<ServiceKey, () => any>();

  register<T>(token: ServiceKey, instance: T): void {
    this.services.set(token, instance);
  }

  registerFactory<T>(token: ServiceKey, factory: () => T): void {
    this.factories.set(token, factory);
  }

  resolve<T>(token: ServiceKey): T {
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

  /**
   * Resolve a service by its interface/class
   * @example container.resolveByClass(HttpClient)
   */
  resolveByClass<T>(serviceClass: new (...args: any[]) => T): T {
    return this.resolve<T>(serviceClass);
  }

  has(token: ServiceKey): boolean {
    return this.services.has(token) || this.factories.has(token);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}
