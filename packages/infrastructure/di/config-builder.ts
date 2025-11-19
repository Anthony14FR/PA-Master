import { AppContainer } from "./container";
import { DI_TOKENS } from "./tokens";
import { HttpClient } from "../../application/ports/http/http-client.interface";
import { Router } from "../../application/ports/routing/router.interface";
import { RouteGuard } from "../../application/ports/routing/route-guard.interface";
import { Interceptor } from "../../application/ports/http/interceptor.interface";

export class AppConfigBuilder {
  private container: AppContainer;

  constructor(container: AppContainer = new AppContainer()) {
    this.container = container;
  }

  withService<T>(token: symbol | string, service: T): this {
    this.container.register(token, service);
    return this;
  }

  withHttpClient(client: HttpClient): this {
    return this.withService(DI_TOKENS.HttpClient, client);
  }

  withRouter(router: Router): this {
    return this.withService(DI_TOKENS.Router, router);
  }

  withGuards(guards: RouteGuard[]): this {
    const existingGuards = this.container.has(DI_TOKENS.RouteGuards)
      ? this.container.resolve<RouteGuard[]>(DI_TOKENS.RouteGuards)
      : [];

    this.container.register(DI_TOKENS.RouteGuards, [
      ...existingGuards,
      ...guards,
    ]);
    return this;
  }

  withInterceptors(interceptors: Interceptor[]): this {
    const existingInterceptors = this.container.has(DI_TOKENS.HttpInterceptors)
      ? this.container.resolve<Interceptor[]>(DI_TOKENS.HttpInterceptors)
      : [];

    this.container.register(DI_TOKENS.HttpInterceptors, [
      ...existingInterceptors,
      ...interceptors,
    ]);
    return this;
  }

  build(): AppContainer {
    if (
      this.container.has(DI_TOKENS.HttpInterceptors) &&
      this.container.has(DI_TOKENS.HttpClient)
    ) {
      const httpClient = this.container.resolve<HttpClient>(
        DI_TOKENS.HttpClient
      );
      const interceptors = this.container.resolve<Interceptor[]>(
        DI_TOKENS.HttpInterceptors
      );

      interceptors.forEach((interceptor) => {
        httpClient.addInterceptor(interceptor);
      });
    }

    if (
      this.container.has(DI_TOKENS.RouteGuards) &&
      this.container.has(DI_TOKENS.Router)
    ) {
      const router = this.container.resolve<Router>(DI_TOKENS.Router);
      const guards = this.container.resolve<RouteGuard[]>(
        DI_TOKENS.RouteGuards
      );

      guards.forEach((guard) => {
        router.addGuard(guard);
      });
    }

    return this.container;
  }
}
