import KLink from "@/shared/components/k-link";
import { Button } from "@/shared/components/ui/button";

export default function Page() {
    return (
        <>
            <p>App page</p>
            <Button asChild variant="outline">
                <KLink context="app" href="/overview">
                    App's Overview
                </KLink>
            </Button>
        </>
    );
}