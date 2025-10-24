import KLink from '@kennelo/components/k-link';
import { Button } from '@kennelo/ui/button';

export default function Page() {
    return (
        <>
            <p>Admin page</p>
            <Button asChild variant="outline">
                <KLink href="/">
                    Go back home
                </KLink>
            </Button>
        </>
    );
}