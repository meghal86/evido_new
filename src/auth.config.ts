import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/landing',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/');
            const isOnLanding = nextUrl.pathname === '/landing';

            if (isOnDashboard) {
                if (isOnLanding) return true; // Allow landing page
                return true; // ALLOW DASHBOARD FOR EVERYONE (Logic changed to support "Connect Later")
                // if (isLoggedIn) return true;
                // return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
