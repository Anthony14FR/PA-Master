import KLink from "@/shared/components/k-link";
import { Button } from "@/shared/components/ui/button";

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