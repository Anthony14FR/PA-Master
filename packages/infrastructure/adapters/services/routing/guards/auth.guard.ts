import {
  RouteGuard,
  RouteGuardContext,
  RouteGuardResult,
} from "../../../../../application/ports/routing/route-guard.interface";
import { AuthService } from "../../../../../application/ports/services/auth-service.interface";

export class AuthGuard implements RouteGuard {
  name = "AuthGuard";
  priority = 50;

  constructor(
    private authService: AuthService,
    private protectedPaths: string[],
    private loginPath: string = "/login"
  ) {}

  async canNavigate(context: RouteGuardContext): Promise<RouteGuardResult> {
    const { to } = context;

    const isProtected = this.protectedPaths.some((path) =>
      to.path.startsWith(path)
    );

    if (!isProtected) {
      return { allow: true };
    }

    const isAuthenticated = await this.authService.isAuthenticated();

    if (isAuthenticated) {
      return { allow: true };
    }

    return {
      allow: {
        path: this.loginPath,
        query: {
          returnUrl: to.path,
        },
      },
      message: "User not authenticated, redirecting to login",
    };
  }
}
