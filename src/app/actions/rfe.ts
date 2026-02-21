'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { analyzeRFE as analyzeWithGemini } from "@/lib/gemini";

export async function analyzeRFE(text: string, filename: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // 1. Analyze with Gemini
        const analysis = await analyzeWithGemini(text);

        // 2. Save to DB
        const rfeRecord = await prisma.rFEResponse.create({
            data: {
                userId: session.user.id,
                filename: filename,
                uploadUrl: '', // We might skip storage for now or add it later
                status: 'ready',
                analysis: analysis
            }
        });

        return { success: true, analysis, id: rfeRecord.id };
    } catch (error) {
        console.error("RFE Analysis Failed:", error);
        return { error: "Failed to analyze RFE" };
    }
}

export async function generateRFEResponse(issueIds: string[]) {
    // Mock AI generation of response text
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
        success: true,
        responseDraft: `Response to Request for Evidence

Regarding the Officer's concern about independent citations:

We respectfully submit that the Beneficiary's work has been widely cited by independent researchers, demonstrating its major significance in the field. Attached as Exhibit B is a Citation Analysis Report filtering out self-citations and highlighting key independent citations from leading institutions such as MIT, Stanford, and Google DeepMind.

Regarding the significance of the IEEE 2020 Best Paper Award:

The IEEE Conference is a top-tier venue with an acceptance rate of less than 15%. Receiving the Best Paper Award places the Beneficiary in the top 0.1% of submissions...`
    };
}
