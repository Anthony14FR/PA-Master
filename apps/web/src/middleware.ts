import { type NextRequest, NextResponse } from "next/server";

function extractSubdomain(request: NextRequest): string | null {
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];

    if (hostname.includes("localhost")) {
        const match = hostname.match(/^([^.]+)\.localhost/);
        return match ? match[1] : null;
    }

    const match = hostname.match(/^([^.]+)\.kennelo\.[a-z]{2,10}$/);
    if (match && match[1] !== "www") {
        return match[1];
    }

    return null;
}

export async function middleware(request: NextRequest) {
    const subdomain = extractSubdomain(request);

    if (subdomain) {
        const { pathname } = request.nextUrl;

        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        const rewritePath = `/s/${subdomain}${pathname}`;
        return NextResponse.rewrite(new URL(rewritePath, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};
