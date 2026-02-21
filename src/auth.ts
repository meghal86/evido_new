import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            authorization: { params: { scope: 'read:user repo user:email' } },
            allowDangerousEmailAccountLinking: true,
        }),
        LinkedIn({
            clientId: process.env.AUTH_LINKEDIN_ID,
            clientSecret: process.env.AUTH_LINKEDIN_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!user || !user.password) {
                    return null;
                }

                const isValid = await bcrypt.compare(password, user.password);

                if (isValid) {
                    return user;
                }

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile, trigger }) {
            if (account) {
                token.accessToken = account.access_token
            }
            // Fetch role + onboarding status from DB on every token refresh
            if (token.sub) {
                const user = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true, onboardingComplete: true }
                });
                if (user) {
                    token.role = user.role;
                    token.onboardingComplete = user.onboardingComplete;
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token.accessToken) {
                // @ts-ignore
                session.accessToken = token.accessToken as string
            }
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            // Expose role and onboarding status on session
            if (session.user) {
                // @ts-ignore
                session.user.role = (token.role as string) || 'petitioner';
                // @ts-ignore
                session.user.onboardingComplete = (token.onboardingComplete as boolean) ?? false;
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    }
})
