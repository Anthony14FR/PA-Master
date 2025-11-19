import Link from "next/link";
import { LinkComponent } from "@kennelo/presentation/shared/adapters/link.adapter";

export const NextJsLinkAdapter: LinkComponent = ({
    href,
    children,
    className,
    prefetch,
    replace,
}) => {
    return (
        <Link href={href} className={className} prefetch={prefetch} replace={replace}>
            {children}
        </Link>
    );
};
