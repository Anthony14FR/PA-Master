import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
    Router,
    RouteParams,
    RouteInfo,
} from "@kennelo/application/ports/routing/router.interface";
import {
    RouteGuard,
    RouteGuardContext,
} from "@kennelo/application/ports/routing/route-guard.interface";

export class NextJsAppRouter implements Router {
    private _guards: RouteGuard[] = [];
    private _nextRouter: AppRouterInstance;

    constructor(nextRouter: AppRouterInstance) {
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

    private _buildUrl(params: RouteParams): string {
        let url = params.path;

        if (params.query && Object.keys(params.query).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(params.query).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => searchParams.append(key, v));
                } else {
                    searchParams.set(key, value);
                }
            });
            url += `?${searchParams.toString()}`;
        }

        if (params.hash) {
            url += params.hash.startsWith("#") ? params.hash : `#${params.hash}`;
        }

        return url;
    }

    async push(params: string | RouteParams): Promise<boolean> {
        const normalizedParams = this._normalizeParams(params);
        const guardResult = await this._executeGuards(normalizedParams);

        if (guardResult === false) {
            return false;
        }

        try {
            const url = this._buildUrl(guardResult);
            this._nextRouter.push(url);
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

        try {
            const url = this._buildUrl(guardResult);
            this._nextRouter.replace(url);
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
        this._nextRouter.forward();
    }

    getCurrentRoute(): RouteInfo {
        if (typeof window === "undefined") {
            return {
                pathname: "",
                query: {},
                hash: "",
                asPath: "",
            };
        }

        const url = new URL(window.location.href);
        const query: Record<string, string | string[]> = {};

        url.searchParams.forEach((value, key) => {
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
            pathname: url.pathname,
            query,
            hash: url.hash,
            asPath: url.pathname + url.search + url.hash,
        };
    }

    async prefetch(path: string): Promise<void> {
        this._nextRouter.prefetch(path);
    }
}