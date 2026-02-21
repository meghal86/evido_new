import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Evido',
  description: 'Evidence for Extraordinary Ability',
}

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

// Force dynamic rendering so the sidebar always shows the latest user plan
export const dynamic = 'force-dynamic';

import { SessionProvider } from "next-auth/react"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  let userPlan = "Free";
  let userRole = "petitioner";
  let onboardingComplete = true;

  if (session?.user?.id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true, role: true, onboardingComplete: true }
      });
      if (user?.plan) userPlan = user.plan;
      if (user?.role) userRole = user.role;
      onboardingComplete = user?.onboardingComplete ?? true;
    } catch (e) {
      console.error("Failed to fetch user data", e);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} flex h-screen bg-gray-50 antialiased`}>
        <SessionProvider session={session}>
          <Sidebar userPlan={userPlan} userRole={userRole} />
          <main className="flex-1 overflow-auto bg-[#ffffff]">
            {children}
          </main>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
