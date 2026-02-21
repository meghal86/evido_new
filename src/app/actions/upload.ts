'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function saveEvidenceRecord(data: {
    title: string,
    description: string,
    url: string,
    filePath: string,
    criterionId: string,
    sourceDate?: Date,
    sourceType?: string,
    exhibitId?: string,
    extractedText?: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.evidenceItem.create({
        data: {
            userId: session.user.id,
            title: data.title,
            description: data.description,
            url: data.url,
            fileUrl: data.filePath,
            criterionId: data.criterionId,
            status: 'pending',
            sourceDate: data.sourceDate,
            sourceType: data.sourceType,
            exhibitId: data.exhibitId,
            attorneyStatus: 'draft', // Default status
            extractedText: data.extractedText
        }
    })

    return { success: true }
}
