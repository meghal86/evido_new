'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getGitHubStats } from "@/lib/github"

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

        // Calculate Criteria Status
        const evidenceByCriterion: Record<string, number> = {};
        user.evidence.forEach((item: any) => {
            if (item.criterionId) {
                evidenceByCriterion[item.criterionId] = (evidenceByCriterion[item.criterionId] || 0) + 1;
            }
        });

        // EB-1A Criteria IDs
        const criteriaIds = [
            'awards', 'membership', 'published', 'judging', 'original',
            'authorship', 'leading', 'salary', 'artistic', 'commercial'
        ];

        let strongCount = 0;
        const criteriaStatus = criteriaIds.map(id => {
            const count = evidenceByCriterion[id] || 0;
            let status = 'Weak';
            if (count >= 3) {
                status = 'Strong';
                strongCount++;
            } else if (count >= 1) { // Changed logic: 1-2 is Medium/Good? Let's say 2 is Medium
                if (count === 2) status = 'Good'; // Using 'Good' to match prompt's scoring? 
                // User prompt for reports says: Strong=3, Good=2, Medium=1, Weak=0.
                // Let's stick to simple: Strong (3+), Medium (1-2), Weak (0) for Dashboard for now?
                // Actually prompt says: "Pull score from user's criteria data... count of STRONG criteria / 10"
                // And for Top Gaps: "Show the 3 weakest... WEAK/MEDIUM badges"
                status = 'Medium';
            }

            // Refine status based on count for score calculation if needed later
            // For dashboard readiness: (Strong / 10) * 100

            return { id, count, status };
        });

        // Determine criteria strength similarly to profile page
        const criteriaStrength: Record<string, string> = {}
        for (const c of criteriaIds) {
            const count = evidenceByCriterion[c] || 0
            if (count >= 3) criteriaStrength[c] = 'Strong'
            else if (count >= 2) criteriaStrength[c] = 'Good'
            else if (count >= 1) criteriaStrength[c] = 'Medium'
            else criteriaStrength[c] = 'Weak'
        }

        // Use the EB-1A weights from profile.ts to keep Readiness Score consistent
        const eb1aWeights: Record<string, number> = {
            awards: 1, membership: 0.8, published: 1, judging: 0.8,
            original: 1.2, authorship: 1, leading: 1, salary: 0.8,
            artistic: 0.5, commercial: 0.8
        }

        let score = 50
        for (const [criterion, weight] of Object.entries(eb1aWeights)) {
            const strength = criteriaStrength[criterion]
            if (strength === 'Strong') score += 10 * weight
            else if (strength === 'Good') score += 5 * weight
            else if (strength === 'Medium') score += 2 * weight
        }

        if (githubStats) {
            if (githubStats.totalStars > 10000) score += 5
            else if (githubStats.totalStars > 1000) score += 3
            if (githubStats.totalRepos > 50) score += 2 // totalRepos instead of publicRepos
        }

        const readinessScore = Math.min(100, Math.max(0, Math.round(score)));

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
