import { prisma } from "@/lib/prisma";
import { calculateCriteriaStatus, calculateReadinessScore } from "./readiness";

export async function getReadinessScore(userId: string): Promise<number> {
    if (!userId) return 0;

    try {
        const evidence = await prisma.evidenceItem.findMany({
            where: { userId },
            select: { criterionId: true }
        });

        // Use 'as any' if strictly needed for type compatibility
        const criteriaStatus = calculateCriteriaStatus(evidence as any);
        return calculateReadinessScore(criteriaStatus);

    } catch (error) {
        console.error("Error calculating readiness:", error);
        return 0;
    }
}
