'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getAttorneyCases() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized", cases: [] };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'attorney') {
            return { error: "Not an attorney", cases: [] };
        }

        // Fetch all CaseAttorney records for this attorney
        const caseRecords = await prisma.caseAttorney.findMany({
            where: { attorneyId: session.user.id },
            include: {
                client: {
                    include: {
                        evidence: {
                            select: {
                                id: true,
                                attorneyStatus: true,
                            }
                        },
                        reports: {
                            select: { id: true }
                        },
                    }
                }
            },
            orderBy: { invitedAt: 'desc' }
        });

        const cases = caseRecords.map(record => {
            const client = record.client;
            const petData = (client.petitionerData as Record<string, unknown>) || {};
            const totalEvidence = client.evidence.length;
            const pending = client.evidence.filter((e: { attorneyStatus: string | null }) => !e.attorneyStatus || e.attorneyStatus === 'pending').length;
            const approved = client.evidence.filter((e: { attorneyStatus: string | null }) => e.attorneyStatus === 'approved').length;

            return {
                id: record.id,
                clientId: client.id,
                clientName: client.name || client.email || 'Unknown',
                clientEmail: client.email,
                clientImage: client.image,
                targetVisa: (petData.target_visa as string) || 'EB-1A',
                status: record.status,
                totalEvidence,
                pendingReview: pending,
                approvedEvidence: approved,
                reportsCount: client.reports.length,
                readiness: totalEvidence > 0 ? Math.round((approved / totalEvidence) * 100) : 0,
                createdAt: record.invitedAt,
            };
        });

        return { cases, error: null };
    } catch (error) {
        console.error("Failed to fetch attorney cases:", error);
        return { error: "Failed to load cases", cases: [] };
    }
}
