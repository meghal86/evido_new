'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateUserProfile(data: { name?: string, email?: string }) {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                // email: data.email, // Email updates usually require verification
            }
        })

        revalidatePath('/settings')
        return { success: true, user }
    } catch (error) {
        return { success: false, error: "Failed to update profile" }
    }
}

export async function getUserProfile() {
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    return user
}
