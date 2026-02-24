import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login', // Redirect users to /login when they need to authenticate
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublicRoute =
                nextUrl.pathname === '/landing' ||
                nextUrl.pathname === '/login' ||
                nextUrl.pathname.startsWith('/api/') || // Assuming webhooks and other APIs handle their own auth
                nextUrl.pathname.startsWith('/_next/') ||
                nextUrl.pathname === '/favicon.ico';

            if (isPublicRoute) {
                return true;
            }

            // All other routes require authentication
            if (isLoggedIn) {
                // If they are logged in and hit login/landing, redirect to dashboard
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/landing') {
                    return Response.redirect(new URL('/', nextUrl));
                }
                return true;
            }

            // Redirect unauthenticated users
            return false;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
