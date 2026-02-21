'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function approveEvidence(evidenceId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    // Verify attorney role (in real app)
    // const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    // if (user?.role !== 'attorney') return { error: "Unauthorized" }

    try {
        await prisma.evidenceItem.update({
            where: { id: evidenceId },
            data: {
                attorneyStatus: 'approved',
                locked: true,
                approvedAt: new Date(),
                auditLogs: {
                    create: {
                        action: 'approved',
                        actorName: session.user.name || 'Attorney',
                        notes: 'Approved by attorney'
                    }
                }
            }
        })
        revalidatePath('/criteria')
        return { success: true }
    } catch (error) {
        console.error("Error approving evidence:", error)
        return { error: "Failed to approve evidence" }
    }
}

export async function rejectEvidence(evidenceId: string, reason: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.evidenceItem.update({
            where: { id: evidenceId },
            data: {
                attorneyStatus: 'rejected',
                locked: false,
                attorneyNotes: reason,
                auditLogs: {
                    create: {
                        action: 'rejected',
                        actorName: session.user.name || 'Attorney',
                        notes: reason
                    }
                }
            }
        })
        revalidatePath('/criteria')
        return { success: true }
    } catch (error) {
        return { error: "Failed to reject evidence" }
    }
}

export async function requestRevision(evidenceId: string, instructions: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.evidenceItem.update({
            where: { id: evidenceId },
            data: {
                attorneyStatus: 'revision_needed',
                locked: false,
                attorneyNotes: instructions,
                auditLogs: {
                    create: {
                        action: 'revision_needed',
                        actorName: session.user.name || 'Attorney',
                        notes: instructions
                    }
                }
            }
        })
        revalidatePath('/criteria')
        return { success: true }
    } catch (error) {
        return { error: "Failed to request revision" }
    }
}
export async function inviteAttorney(email: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Check if attorney user exists
        const attorney = await prisma.user.findUnique({ where: { email } })

        if (!attorney) {
            // In a real app, we would send an invite email to join the platform
            // For now, return error or mock invite
            return { error: "User not found. Ask your attorney to sign up first." }
        }

        if (attorney.role !== 'attorney') {
            return { error: "This user is not registered as an attorney." }
        }

        // Create CaseAttorney record
        await prisma.caseAttorney.create({
            data: {
                clientId: session.user.id,
                attorneyId: attorney.id,
                status: 'pending'
            }
        })

        revalidatePath('/settings')
        return { success: true }
    } catch (error) {
        console.error("Invite Error:", error)
        return { error: "Failed to invite attorney. They might already be invited." }
    }
}
