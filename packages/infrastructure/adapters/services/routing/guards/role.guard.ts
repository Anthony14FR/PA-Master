// infrastructure/adapters/routing/guards/role.guard.ts
import {
  RouteGuard,
  RouteGuardContext,
  RouteGuardResult,
} from "../../../../../application/ports/routing/route-guard.interface";
import { AuthService } from "../../../../../application/ports/services/auth-service.interface";

export interface RouteRoleConfig {
  path: string;
  roles: string[];
}

export class RoleGuard implements RouteGuard {
  name = "RoleGuard";
  priority = 40;

  constructor(
    private authService: AuthService,
    private routeConfigs: RouteRoleConfig[],
    private forbiddenPath: string = "/forbidden"
  ) {}

  async canNavigate(context: RouteGuardContext): Promise<RouteGuardResult> {
    const { to } = context;

    const config = this.routeConfigs.find((c) => to.path.startsWith(c.path));

    if (!config) {
      return { allow: true };
    }

    const userRoles = await this.authService.getCurrentUserRoles();

    if (!userRoles) {
      return {
        allow: {
          path: this.forbiddenPath,
        },
        message: "User not found or has no roles",
      };
    }

    const hasRequiredRole = config.roles.some((role) =>
      userRoles.includes(role)
    );

    if (hasRequiredRole) {
      return { allow: true };
    }

    return {
      allow: {
        path: this.forbiddenPath,
      },
      message: `User does not have required roles: ${config.roles.join(", ")}`,
    };
  }
}
