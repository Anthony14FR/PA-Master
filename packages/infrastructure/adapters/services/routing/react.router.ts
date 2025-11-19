import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Router,
  RouteParams,
  RouteInfo,
} from "../../../../application/ports/routing/router.interface";
import {
  RouteGuard,
  RouteGuardContext,
} from "../../../../application/ports/routing/route-guard.interface";

export class ReactRouter implements Router {
  private guards: RouteGuard[] = [];
  private navigate: ReturnType<typeof useNavigate>;
  private location: ReturnType<typeof useLocation>;
  private params: Record<string, string>;

  constructor(
    navigate: ReturnType<typeof useNavigate>,
    location: ReturnType<typeof useLocation>,
    params: Record<string, string> = {}
  ) {
    this.navigate = navigate;
    this.location = location;
    this.params = params;
  }

  addGuard(guard: RouteGuard): void {
    this.guards.push(guard);
    this.guards.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  removeGuard(guard: RouteGuard): void {
    this.guards = this.guards.filter((g) => g !== guard);
  }

  private async executeGuards(to: RouteParams): Promise<RouteParams | false> {
    const from = this.getCurrentRoute();
    const context: RouteGuardContext = { from, to, router: this };

    for (const guard of this.guards) {
      const result = await guard.canNavigate(context);

      if (result.allow === false) {
        console.log(`[Router] Navigation blocked by guard: ${guard.name}`);
        return false;
      }

      if (typeof result.allow === "object") {
        console.log(`[Router] Navigation redirected by guard: ${guard.name}`);
        return result.allow;
      }
    }

    return to;
  }

  private normalizeParams(params: string | RouteParams): RouteParams {
    if (typeof params === "string") {
      return { path: params };
    }
    return params;
  }

  private buildPath(params: RouteParams): string {
    let path = params.path;

    // Ajouter query string
    if (params.query && Object.keys(params.query).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params.query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      });
      path += `?${searchParams.toString()}`;
    }

    // Ajouter hash
    if (params.hash) {
      path += params.hash.startsWith("#") ? params.hash : `#${params.hash}`;
    }

    return path;
  }

  async push(params: string | RouteParams): Promise<boolean> {
    const normalizedParams = this.normalizeParams(params);
    const guardResult = await this.executeGuards(normalizedParams);

    if (guardResult === false) {
      return false;
    }

    const path = this.buildPath(guardResult);
    this.navigate(path, { state: guardResult.state });
    return true;
  }

  async replace(params: string | RouteParams): Promise<boolean> {
    const normalizedParams = this.normalizeParams(params);
    const guardResult = await this.executeGuards(normalizedParams);

    if (guardResult === false) {
      return false;
    }

    const path = this.buildPath(guardResult);
    this.navigate(path, { replace: true, state: guardResult.state });
    return true;
  }

  back(): void {
    this.navigate(-1);
  }

  forward(): void {
    this.navigate(1);
  }

  getCurrentRoute(): RouteInfo {
    const searchParams = new URLSearchParams(this.location.search);
    const query: Record<string, string | string[]> = {};

    searchParams.forEach((value, key) => {
      const existing = query[key];
      if (existing) {
        query[key] = Array.isArray(existing)
          ? [...existing, value]
          : [existing, value];
      } else {
        query[key] = value;
      }
    });

    return {
      pathname: this.location.pathname,
      query,
      hash: this.location.hash,
      asPath:
        this.location.pathname + this.location.search + this.location.hash,
      params: this.params,
    };
  }
}
