'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function unlinkAccount(provider: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.account.deleteMany({
            where: {
                userId: session.user.id,
                provider: provider
            }
        });

        // Revalidate common paths where connection status is shown
        revalidatePath('/')
        revalidatePath('/settings')
        revalidatePath('/profile')

        return { success: true }
    } catch (error) {
        console.error(`Failed to unlink ${provider}:`, error)
        return { error: `Failed to disconnect ${provider} account` }
    }
}
