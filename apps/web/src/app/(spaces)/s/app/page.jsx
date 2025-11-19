"use client";

import { Button } from "@kennelo/presentation/shared/components/ui/button";
import { AppLink } from "@kennelo/presentation/shared/components/app-link";

export default function Page() {
    return (
        <>
            <p>App page</p>
            <Button asChild variant="outline">
                <AppLink href="/s/app/overview">
                    App's Overview
                </AppLink>
            </Button>
        </>
    );
}