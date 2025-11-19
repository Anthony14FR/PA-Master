import { useRouter as useNextRouter } from "next/router";
import {
  Router,
  RouteParams,
  RouteInfo,
} from "../../../../application/ports/routing/router.interface";
import {
  RouteGuard,
  RouteGuardContext,
} from "../../../../application/ports/routing/route-guard.interface";

export class NextJsRouter implements Router {
  private _guards: RouteGuard[] = [];
  private _nextRouter: ReturnType<typeof useNextRouter>;

  constructor(nextRouter: ReturnType<typeof useNextRouter>) {
    this._nextRouter = nextRouter;
  }

  addGuard(guard: RouteGuard): void {
    this._guards.push(guard);
    this._guards.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  removeGuard(guard: RouteGuard): void {
    this._guards = this._guards.filter((g) => g !== guard);
  }

  private async _executeGuards(to: RouteParams): Promise<RouteParams | false> {
    const from = this.getCurrentRoute();
    const context: RouteGuardContext = {
      from,
      to,
      router: this,
    };

    for (const guard of this._guards) {
      const result = await guard.canNavigate(context);

      if (result.allow === false) {
        console.log(
          `[Router] Navigation blocked by guard: ${guard.name}`,
          result.message
        );
        return false;
      }

      if (typeof result.allow === "object") {
        console.log(
          `[Router] Navigation redirected by guard: ${guard.name}`,
          result.allow
        );
        return result.allow;
      }
    }

    return to;
  }

  private _normalizeParams(params: string | RouteParams): RouteParams {
    if (typeof params === "string") {
      return { path: params };
    }
    return params;
  }

  async push(params: string | RouteParams): Promise<boolean> {
    const normalizedParams = this._normalizeParams(params);
    const guardResult = await this._executeGuards(normalizedParams);

    if (guardResult === false) {
      return false;
    }

    const finalParams = guardResult;

    try {
      await this._nextRouter.push({
        pathname: finalParams.path,
        query: finalParams.query,
        hash: finalParams.hash,
      });
      return true;
    } catch (error) {
      console.error("[Router] Push failed:", error);
      return false;
    }
  }

  async replace(params: string | RouteParams): Promise<boolean> {
    const normalizedParams = this._normalizeParams(params);
    const guardResult = await this._executeGuards(normalizedParams);

    if (guardResult === false) {
      return false;
    }

    const finalParams = guardResult;

    try {
      await this._nextRouter.replace({
        pathname: finalParams.path,
        query: finalParams.query,
        hash: finalParams.hash,
      });
      return true;
    } catch (error) {
      console.error("[Router] Replace failed:", error);
      return false;
    }
  }

  back(): void {
    this._nextRouter.back();
  }

  forward(): void {
    if (typeof window !== "undefined") {
      window.history.forward();
    }
  }

  getCurrentRoute(): RouteInfo {
    return {
      pathname: this._nextRouter.pathname,
      query: this._nextRouter.query,
      hash: typeof window !== "undefined" ? window.location.hash : "",
      asPath: this._nextRouter.asPath,
    };
  }

  async prefetch(path: string): Promise<void> {
    await this._nextRouter.prefetch(path);
  }
}
