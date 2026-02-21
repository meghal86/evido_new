'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { geminiModel } from "@/lib/gemini"


export async function addExpert(data: {
    expertName: string;
    expertTitle: string;
    expertOrg: string;
    expertEmail: string;
    expertPhone?: string;
    expertLinkedin?: string;
    relationship: string;
    notes?: string;
}) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const letter = await prisma.recommendationLetter.create({
            data: {
                userId: session.user.id,
                ...data,
                status: 'not_requested'
            }
        });
        revalidatePath('/letters');
        return { success: true, letter };
    } catch (error) {
        console.error("Error adding expert:", error);
        return { error: `Failed to add expert: ${error instanceof Error ? error.message : String(error)}` };
    }
}

export async function requestLetter(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // In a real app, send email here using Resend or similar
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // 2 weeks default

        await prisma.recommendationLetter.update({
            where: { id },
            data: {
                status: 'requested',
                requestedDate: new Date(),
                dueDate: dueDate
            }
        });
        revalidatePath('/letters');
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status" };
    }
}

export async function updateLetterStatus(id: string, status: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.recommendationLetter.update({
            where: { id },
            data: {
                // @ts-ignore
                status
            }
        });
        revalidatePath('/letters');
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status" };
    }
}

export async function updateLetterDueDate(id: string, date: Date) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.recommendationLetter.update({
            where: { id },
            data: {
                dueDate: date
            }
        });
        revalidatePath('/letters');
        return { success: true };
    } catch (error) {
        return { error: "Failed to update due date" };
    }
}

export async function deleteLetter(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.recommendationLetter.delete({
            where: { id }
        });
        revalidatePath('/letters');
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete" };
    }
}

export async function getLetters() {
    const session = await auth()
    if (!session?.user?.id) return []

    return await prisma.recommendationLetter.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' }
    })
}

export async function generateLetterDraft(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "Unauthorized" }

    const letter = await prisma.recommendationLetter.findFirst({
        where: { id, userId: session.user.id }
    })

    if (!letter) return { success: false, error: "Letter not found" }

    // Fetch user evidence to inform the letter
    const evidence = await prisma.evidenceItem.findMany({
        where: { userId: session.user.id },
        take: 10 // Take top evidence
    })

    const prompt = `
    Write a strong, formal EB-1A recommendation letter for an alien of extraordinary ability.
    
    Recommender: ${letter.expertName}, ${letter.expertTitle} at ${letter.expertOrg}
    Relationship: ${letter.relationship}
    
    Key Evidence to Highlight:
    ${evidence.map(e => `- ${e.title}: ${e.description}`).join('\n')}
    
    The letter should be:
    1. Addressed to "USCIS Adjudicating Officer".
    2. Start by establishing the recommender's expertise.
    3. Describe the relationship.
    4. highlight specific contributions (from evidence).
    5. Conclude with a strong endorsement of the "extraordinary ability" classification.
    6. About 800-1000 words.
    
    Return ONLY the markdown text of the letter.
    `

    try {
        const result = await geminiModel.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Store draft in aiFeedback since content column doesn't exist
        const currentFeedback = (letter.aiFeedback as any) || {};

        await prisma.recommendationLetter.update({
            where: { id },
            data: {
                aiFeedback: { ...currentFeedback, draft: text },
                status: 'draft_received' // Update status
            }
        })

        revalidatePath(`/letters/${id}`)
        revalidatePath('/letters')
        return { success: true, content: text }
    } catch (error) {
        console.error("Letter Generation Error Details:", error)
        // @ts-ignore
        if (error.message) console.error("Error Message:", error.message);
        // @ts-ignore
        if (error.stack) console.error("Error Stack:", error.stack);

        // Fallback for development/testing if API fails
        if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_MOCK_AI === 'true') {
            const mockText = `[MOCK DRAFT - API FAILED]
Dear U.S. Citizenship and Immigration Services Officer,

I write this letter in enthusiastic support of the EB-1A petition for [Petitioner Name]. As the ${letter.expertTitle} at ${letter.expertOrg}, I have had the pleasure of...

(This is a generated placeholder because the AI service was unavailable.)

 Sincerely,
 ${letter.expertName}`;

            const currentFeedback = (letter.aiFeedback as any) || {};
            await prisma.recommendationLetter.update({
                where: { id },
                data: {
                    aiFeedback: { ...currentFeedback, draft: mockText },
                    status: 'draft_received'
                }
            })
            revalidatePath(`/letters/${id}`)
            revalidatePath('/letters')
            return { success: true, content: mockText }
        }

        return { success: false, error: `Failed to generate draft: ${error instanceof Error ? error.message : String(error)}` }
    }
}

export async function updateLetterContent(id: string, content: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Get existing feedback to preserve other fields
        const letter = await prisma.recommendationLetter.findFirst({
            where: { id, userId: session.user.id }
        })

        const currentFeedback = (letter?.aiFeedback as any) || {};

        await prisma.recommendationLetter.update({
            where: { id },
            data: {
                aiFeedback: { ...currentFeedback, draft: content }
            }
        });
        revalidatePath('/letters');
        return { success: true };
    } catch (error) {
        return { error: "Failed to save content" };
    }
}
