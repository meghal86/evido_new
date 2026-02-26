'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getFullGitHubProfile } from "@/lib/github"

export async function getProfileData() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { error: "Session Invalid: " + JSON.stringify(session) }
        }

        const user = await (prisma.user as any).findUnique({
            where: { id: session.user.id },
            include: { accounts: true, evidence: true }
        })

        if (!user) {
            console.warn("User Not Found in DB: " + session.user.id + ". Returning partial profile.");
            return {
                user: {
                    name: session.user.name || "User",
                    email: session.user.email || "user@example.com",
                    image: session.user.image || "",
                    plan: "Free",
                },
                github: null,
                visaScores: {
                    eb1a: { score: 0, status: "Needs Setup" },
                    o1: { score: 0, status: "Needs Setup" },
                    eb2niw: { score: 0, status: "Needs Setup" }
                },
                githubConnected: false
            }
        }

        const githubAccount = user.accounts.find((a: any) => a.provider === 'github')

        // @ts-ignore
        const token = session.accessToken || githubAccount?.access_token

        let githubProfile: Awaited<ReturnType<typeof getFullGitHubProfile>> = null
        if (token) {
            githubProfile = await getFullGitHubProfile(token, session.user.id)
        }

        // Compute visa readiness scores from evidence items
        const evidenceByCriterion: Record<string, number> = {}
        const evidence = user.evidence || []
        for (const item of evidence) {
            evidenceByCriterion[item.criterionId] = (evidenceByCriterion[item.criterionId] || 0) + 1
        }

        const criteriaStrength: Record<string, string> = {}
        const criteriaList = ['awards', 'membership', 'published', 'judging', 'original', 'authorship', 'leading', 'salary', 'artistic', 'commercial']
        for (const c of criteriaList) {
            const count = evidenceByCriterion[c] || 0
            if (count >= 3) criteriaStrength[c] = 'Strong'
            else if (count >= 2) criteriaStrength[c] = 'Good'
            else if (count >= 1) criteriaStrength[c] = 'Medium'
            else criteriaStrength[c] = 'Weak'
        }

        // Calculate visa scores with distinct baselines
        function computeScore(weights: Record<string, number>, baseline: number) {
            let score = baseline;
            for (const [criterion, weight] of Object.entries(weights)) {
                const strength = criteriaStrength[criterion]
                if (strength === 'Strong') score += 10 * weight
                else if (strength === 'Good') score += 6 * weight
                else if (strength === 'Medium') score += 3 * weight
            }
            // Bonus for GitHub metrics
            if (githubProfile) {
                if (githubProfile.stats.totalStars > 10000) score += 6
                else if (githubProfile.stats.totalStars > 1000) score += 4
                if (githubProfile.stats.publicRepos > 50) score += 3
            }
            // Add slight randomness based on user email length so they aren't completely flat across visas
            // for users with 0 evidence
            const jitter = (session?.user?.email?.length || 10) % 3;
            score += jitter;

            return Math.min(100, Math.max(0, Number(score.toFixed(1))));
        }

        // EB-1A is hardest - low baseline, high requirement for original/leading
        const eb1aWeights: Record<string, number> = {
            awards: 1.2, membership: 0.8, published: 1, judging: 1,
            original: 1.5, authorship: 1.2, leading: 1.5, salary: 0.8,
            artistic: 0.2, commercial: 0.8
        }

        // O-1 is more flexible - higher baseline, emphasis on awards and critical roles
        const o1Weights: Record<string, number> = {
            awards: 1.5, membership: 0.5, published: 0.8, judging: 0.8,
            original: 1.0, authorship: 0.8, leading: 1.8, salary: 1.2,
            artistic: 0.5, commercial: 1.0
        }

        // NIW focuses heavily on impact and publications, highest baseline assuming a degree
        const eb2niwWeights: Record<string, number> = {
            awards: 0.5, membership: 0.5, published: 1.5, judging: 0.5,
            original: 1.8, authorship: 1.5, leading: 0.8, salary: 0.5,
            artistic: 0.2, commercial: 1.5
        }

        const eb1aScore = computeScore(eb1aWeights, 35) // Hardest baseline
        const o1Score = computeScore(o1Weights, 42) // Medium baseline
        const eb2niwScore = computeScore(eb2niwWeights, 48) // Easiest baseline for degree holders

        function getStatus(score: number) {
            if (score >= 85) return 'Strong Candidate'
            if (score >= 70) return 'Good Candidate'
            if (score >= 50) return 'Developing Candidate'
            return 'Needs Work'
        }

        return {
            user: {
                name: user.name,
                email: user.email,
                image: user.image,
                plan: user.plan || "Free",
            },
            github: githubProfile,
            visaScores: {
                eb1a: { score: eb1aScore, status: getStatus(eb1aScore) },
                o1: { score: o1Score, status: getStatus(o1Score) },
                eb2niw: { score: eb2niwScore, status: getStatus(eb2niwScore) },
            },
            githubConnected: !!githubAccount,
        }
    } catch (error: any) {
        console.error("Profile Data Error:", error)
        // Fallback for resiliency - never crash the profile page
        return {
            user: {
                name: "Guest User",
                email: "guest@example.com",
                image: "",
                plan: "Free",
            },
            github: {
                profile: {
                    login: "guest",
                    name: "Guest User",
                    bio: "Profile unavailable. Please try reconnecting.",
                    company: "Unknown",
                    location: "Unknown",
                    followers: 0,
                    joinedDate: "2024",
                    htmlUrl: "https://github.com"
                },
                stats: { totalStars: 0, totalForks: 0, publicRepos: 0, contributions: 0 },
                topRepos: []
            },
            visaScores: {
                eb1a: { score: 0, status: "Needs Data" },
                o1: { score: 0, status: "Needs Data" },
                eb2niw: { score: 0, status: "Needs Data" }
            },
            githubConnected: false,
            error: "Profile load failed, showing guest view."
        }
    }
}
