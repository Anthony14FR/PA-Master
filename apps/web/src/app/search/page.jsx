import KLink from '@kennelo/ui/components/composed/k-link';
import { Button } from '@kennelo/ui/components/shadcn/button';

export default function Page() {
    return (
        <>
            <p>Search page</p>
            <Button asChild variant="outline">
                <KLink href="/apps/web/public">
                    Search page
                </KLink>
            </Button>
        </>
    );
}