import { NextResponse } from 'next/server'

export function middleware(request) {
    // Gérer le cas ou l'utilisateur n'est pas connecté
    // return NextResponse.redirect(new URL('/auth/login', request.url))
}