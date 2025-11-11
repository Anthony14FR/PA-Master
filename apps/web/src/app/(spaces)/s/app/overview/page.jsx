import KLink from '@kennelo/ui/components/composed/k-link';
import { Button } from '@kennelo/ui/components/shadcn/button';

export default function Page() {
    return (
        <>
            <p>App page</p>
            <Button asChild variant="outline">
                <KLink context="app" href="/">
                    App's home page
                </KLink>
            </Button>
        </>
    );
}