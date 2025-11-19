"use client";

import { Button } from "@kennelo/presentation/shared/components/ui/button";
import { AppLink } from "@kennelo/presentation/shared/components/app-link";

export default function Page() {
    return (
        <>
            <p>Admin page</p>
            <Button asChild variant="outline">
                <AppLink href="/">
                    Go back home
                </AppLink>
            </Button>
        </>
    );
}