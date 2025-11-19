import KLink from '@kennelo/components/k-link';
import { Button } from '@kennelo/ui/button';

export default function Page() {
    return (
        <>
            <p>Search page</p>
            <Button asChild variant="outline">
                <AppLink href="/apps/web/public">
                    Search page
                </KLink>
            </Button>
        </>
    );
}