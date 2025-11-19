import { RouteGuard } from "./route-guard.interface";

export interface RouteParams {
  path: string;
  query?: Record<string, string | string[]>;
  hash?: string;
  state?: any;
  preserveQuery?: boolean;
}

export interface RouteInfo {
  pathname: string;
  query: Record<string, string | string[]>;
  hash: string;
  asPath: string;
  params?: Record<string, string>;
}

export interface Router {
  push(params: string | RouteParams): Promise<boolean>;
  replace(params: string | RouteParams): Promise<boolean>;
  back(): void;
  forward(): void;

  getCurrentRoute(): RouteInfo;

  addGuard(guard: RouteGuard): void;
  removeGuard(guard: RouteGuard): void;

  prefetch?(path: string): Promise<void>;
}
