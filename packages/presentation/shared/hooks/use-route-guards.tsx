import { useAppContainer } from "../contexts/app-container.context";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { RouteGuard } from "../../../application/ports/routing/route-guard.interface";

export function useRouteGuards(): RouteGuard[] {
    const container = useAppContainer();

    if (!container.has(DI_TOKENS.RouteGuards)) {
        return [];
    }

    return container.resolve<RouteGuard[]>(DI_TOKENS.RouteGuards);
}
