'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { geminiModel, generateAnalysisPrompt } from "@/lib/gemini"
import { revalidatePath } from "next/cache"

import { calculateCriteriaStatus, calculateReadinessScore } from "@/lib/readiness";

export async function generateReport() {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized: No session" }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { evidence: true }
        })

        if (!user) {
            return { success: false, error: "User not found in database" }
        }

        const prompt = generateAnalysisPrompt(user.evidence || [])

        let data: { analysis: string | null, overallScore: number } = { analysis: null, overallScore: 0 };
        try {
            const result = await geminiModel.generateContent(prompt); // Gemini call
            const response = await result.response;
            const text = response.text();
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            data = JSON.parse(cleanJson);
        } catch (geminiError: any) {
            console.error("Gemini Error:", geminiError);
            // Fallback if Gemini fails (e.g. no API key)
            data = {
                analysis: "## AI Analysis Unavailable\n\nAI features are currently unavailable. Generating detailed breakdown based on evidence.",
                overallScore: 0
            };
        }

        // Calculate deterministic score based on evidence count
        const criteriaStatus = calculateCriteriaStatus(user.evidence as any);
        const score = calculateReadinessScore(criteriaStatus);

        // Structure the content to include both analysis and breakdown
        const reportContent = {
            analysis: typeof data.analysis === 'string' ? data.analysis : JSON.stringify(data),
            breakdown: criteriaStatus
        };

        const report = await prisma.report.create({
            data: {
                userId: user.id,
                title: `EB-1A Case Analysis - ${new Date().toLocaleDateString()}`,
                content: JSON.stringify(reportContent),
                score: score, // Use deterministic score
            }
        })

        revalidatePath('/reports')
        return { success: true, report }
    } catch (error: any) {
        console.error("Report Generation Error:", error)
        return { success: false, error: `Generation Failed: ${error.message}` }
    }
}

export async function getReports() {
    const session = await auth()
    if (!session?.user?.id) return []

    return await prisma.report.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })
}
