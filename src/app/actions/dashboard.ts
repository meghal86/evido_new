'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getGitHubStats } from "@/lib/github"
import { calculateCriteriaStatus, calculateReadinessScore } from "@/lib/readiness"

export async function getDashboardData() {
    try {
        const session = await auth()
        if (!session?.user?.id) return null

        // Using any-cast for resilience
        const user = await (prisma.user as any).findUnique({
            where: { id: session.user.id },
            include: {
                accounts: true,
                evidence: true
            }
        })

        if (!user) return null

        const githubAccount = user.accounts.find((a: any) => a.provider === 'github')

        // @ts-ignore
        const token = session.accessToken || githubAccount?.access_token

        let githubStats = null
        if (token) {
            githubStats = await getGitHubStats(token, session.user.id)
        }

        // Calculate Criteria Status using the centralized logic
        const criteriaStatus = calculateCriteriaStatus(
            user.evidence.map((item: any) => ({ criterionId: item.criterionId }))
        );

        // Calculate readiness score using the centralized logic
        let githubProfileData = null;
        if (githubStats) {
            githubProfileData = {
                stats: {
                    totalStars: githubStats.totalStars,
                    totalRepos: githubStats.totalRepos
                }
            };
        }

        const readinessScore = Math.round(calculateReadinessScore(criteriaStatus, githubProfileData, session?.user?.email || ''));

        // Check for RecommendationLetter model existence dynamically
        let letterCount = 0
        try {
            // @ts-ignore
            letterCount = await prisma.recommendationLetter.count({ where: { userId: session.user.id } })
        } catch (e) {
            console.warn("Letter model not found or count failed", e)
        }

        return {
            connections: {
                github: !!githubAccount,
                linkedin: false, // TODO: Implement LinkedIn
                scholar: false   // TODO: Implement Scholar
            },
            githubStats,
            user,
            counts: {
                evidence: user.evidence.length,
                letters: letterCount
            },
            readinessScore,
            criteriaStatus
        }
    } catch (error) {
        console.error("Dashboard Data Error:", error)
        return null
    }
}
