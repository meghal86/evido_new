'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createEvidenceItem(data: {
    title: string;
    description?: string;
    criterionId: string;
    exhibitId?: string;
    sourceType?: string;
    sourceDate?: Date;
    metrics?: any;
    extractedText?: string;
    aiAnalysis?: any;
    fileUrl?: string; // in real app, this would be Supabase URL
}) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Auto-generate exhibit ID if not provided (simple increment for now)
        let exhibitId = data.exhibitId;
        if (!exhibitId) {
            const count = await prisma.evidenceItem.count({
                where: { userId: session.user.id }
            });
            exhibitId = `Exhibit-${count + 1}`;
        }

        const evidence = await prisma.evidenceItem.create({
            data: {
                userId: session.user.id,
                title: data.title,
                description: data.description,
                criterionId: data.criterionId,
                exhibitId: exhibitId,
                sourceType: data.sourceType || 'Manual Upload',
                sourceDate: data.sourceDate,
                metrics: data.metrics,
                extractedText: data.extractedText,
                aiAnalysis: data.aiAnalysis,
                fileUrl: data.fileUrl,
                status: 'draft',
                attorneyStatus: 'draft'
            }
        });

        revalidatePath('/criteria');
        revalidatePath(`/criteria/${data.criterionId}`);
        return { success: true, evidence };
    } catch (error) {
        console.error("Error creating evidence:", error);
        return { error: "Failed to create evidence item" };
    }
}

import { getUserRepos } from "@/lib/github";
import { getCriteriaForRepo } from "@/lib/criteria-mapping";

export async function syncGitHubEvidence() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // Get GitHub token
        const user = await (prisma.user as any).findUnique({
            where: { id: session.user.id },
            include: { accounts: true }
        });

        const githubAccount = user?.accounts.find((a: any) => a.provider === 'github');
        // @ts-ignore
        const token = session.accessToken || githubAccount?.access_token;

        if (!token) return { error: "No GitHub connection found" };

        const repos = await getUserRepos(token);
        if (!repos || repos.length === 0) return { success: true, count: 0 };

        let createdCount = 0;

        for (const repo of repos) {
            const criteriaIds = getCriteriaForRepo(repo);

            for (const criterionId of criteriaIds) {
                // Check if already exists to avoid duplicates
                const existing = await prisma.evidenceItem.findFirst({
                    where: {
                        userId: session.user.id,
                        criterionId: criterionId,
                        url: repo.url // Unique constraint logic
                    }
                });

                if (!existing) {
                    await prisma.evidenceItem.create({
                        data: {
                            userId: session.user.id,
                            title: repo.name,
                            description: repo.description || `Imported from GitHub. ${repo.stars} Stars, ${repo.language}.`,
                            criterionId: criterionId,
                            exhibitId: `GH-${repo.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`, // Temp ID generation
                            sourceType: 'GitHub',
                            sourceDate: repo.created_at ? new Date(repo.created_at) : new Date(),
                            metrics: { stars: repo.stars, forks: repo.forks, language: repo.language },
                            url: repo.url,
                            status: 'draft',
                            attorneyStatus: 'draft'
                        }
                    });
                    createdCount++;
                }
            }
        }

        revalidatePath('/criteria');
        return { success: true, count: createdCount };

    } catch (error) {
        console.error("Sync Error:", error);
        return { error: "Failed to sync evidence" };
    }
}

export async function approveEvidence(evidenceId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

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
