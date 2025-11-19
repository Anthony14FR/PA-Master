"use client";

import { ReactNode } from "react";
import { useRouteGuards } from "../hooks/use-route-guards";

interface RequireAuthProps {
    children: ReactNode;
    fallback?: ReactNode;
    requiredRoles?: string[];
}

export function RequireAuth({
    children,
    fallback = null,
    requiredRoles,
}: RequireAuthProps) {
    const guards = useRouteGuards();

    const authGuard = guards.find((g) => g.name === "AuthGuard");

    if (!authGuard && !requiredRoles) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
