import { NextResponse } from 'next/server'

export function middleware(request) {
    const { pathname } = request.nextUrl

    if (pathname.match(/^\/(auth)/)) {
        const token = request.cookies.get('auth_token')
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    if (pathname.match(/^\/(dashboard)/)) {
        const token = request.cookies.get('auth_token')
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/auth/:path*',
        '/dashboard/:path*'
    ]
}