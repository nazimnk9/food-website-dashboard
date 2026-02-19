import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Define public routes that don't require authentication
    const isPublicRoute = pathname === '/login' || pathname === '/' || pathname.startsWith('/_next') || pathname.includes('/api/') || pathname.includes('.')

    // Get the tokens from cookies
    const accessToken = request.cookies.get('access_token')?.value

    // If the user is trying to access a protected route without a token, redirect to login
    if (!accessToken && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If the user is trying to access the login page with a token, redirect to dashboard
    if (accessToken && pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
