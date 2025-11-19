import { NextRequest } from "next/server";
import { defaultLocale, domainLocaleMap, Locale } from "../config/app.config";

export function getLocaleFromDomain(hostname: string): Locale {
    const domain = hostname.match(/[^.]+\.[a-z]{2,10}$/)?.[0];
    return domain ? domainLocaleMap[domain] || defaultLocale : defaultLocale;
}

export function extractSubdomain(request: NextRequest): string | null {
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
