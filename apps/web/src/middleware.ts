import {type NextRequest, NextResponse} from "next/server";
import {extractSubdomain, getLocaleFromDomain} from "./lib/utils";
import {getCountryFromIP} from "./lib/geoip";
import {locales} from "./config/app.config";
import {NextCookieStorage} from "@kennelo/infrastructure/adapters/services/storage/next-cookie.storage";

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    const hostname = request.headers.get("host") || "";
    const subdomain = extractSubdomain(request);

    const country = await getCountryFromIP(
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        request.ip
    );

    const response = subdomain
        ? NextResponse.rewrite(new URL(`/s/${subdomain}${pathname}`, request.url))
        : NextResponse.next();

    const storage = new NextCookieStorage(response.cookies, {httpOnly: false});
    if (country) storage.set("country", country);

    if (subdomain) {
        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return response;
    }

    if (pathname.startsWith("/s/") || pathname.startsWith("/api/")) {
        return response;
    }

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        return response;
    }

    const domainLocale = getLocaleFromDomain(hostname);
    request.nextUrl.pathname = `/${domainLocale}${pathname}`;

    return NextResponse.rewrite(request.nextUrl);
}

export const config = {
    matcher: ["/((?!_next|_static|_vercel|favicon.ico|.*\\..*).*)"],
};
