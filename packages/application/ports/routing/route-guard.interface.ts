import { RouteInfo, RouteParams, Router } from "./router.interface";

export interface RouteGuardContext {
  from: RouteInfo;
  to: RouteParams;
  router: Router;
}

export interface RouteGuardResult {
  allow: boolean | RouteParams;
  message?: string;
}

export interface RouteGuard {
  name: string;
  priority?: number;
  canNavigate(
    context: RouteGuardContext
  ): Promise<RouteGuardResult> | RouteGuardResult;
}
