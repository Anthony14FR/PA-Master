"use client"

import { ReactNode, useEffect, useState } from "react";
import { useRouteGuards } from "../hooks/use-route-guards";
import { useRouter, useAuthService } from "../hooks/use-services";

interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
    loader?: ReactNode;
}

export function ProtectedRoute({
    children,
    fallback = null,
    loader = null,
}: ProtectedRouteProps) {
    const guards = useRouteGuards();
    const router = useRouter();
    const authService = useAuthService();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            setIsChecking(true);

            if (guards.length === 0) {
                setIsAllowed(true);
                setIsChecking(false);
                return;
            }

            const currentRoute = router.getCurrentRoute();
            const sortedGuards = [...guards].sort(
                (a, b) => (b.priority || 0) - (a.priority || 0)
            );

            for (const guard of sortedGuards) {
                const result = await guard.canNavigate({
                    from: currentRoute,
                    to: { path: currentRoute.pathname },
                    router,
                });

                if (result.allow === false) {
                    setIsAllowed(false);
                    setIsChecking(false);
                    return;
                }

                if (typeof result.allow === "object") {
                    setIsAllowed(false);
                    setIsChecking(false);
                    await router.push(result.allow);
                    return;
                }
            }

            setIsAllowed(true);
            setIsChecking(false);
        };

        checkAccess();
    }, [guards, router, authService]);

    if (isChecking) {
        return <>{loader}</>;
    }

    if (!isAllowed) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
