'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

import { getGitHubStats } from "@/lib/github"

export async function getCriteriaData() {
    const session = await auth()

    if (!session?.user?.id) return null

    const user = await (prisma.user as any).findUnique({
        where: { id: session.user.id },
        include: {
            evidence: true,
            accounts: true
        }
    })

    if (!user) return null

    const githubAccount = user.accounts.find((a: any) => a.provider === 'github')
    // @ts-ignore
    const token = session.accessToken || githubAccount?.access_token

    let repos: any[] = []
    if (token) {
        try {
            const stats = await getGitHubStats(token)
            if (stats) {
                repos = stats.recentRepos || []
            }
        } catch (e) {
            console.error("Failed to fetch repos for criteria page", e)
        }
    }

    return {
        evidenceCount: user.evidence.length || 0,
        evidence: user.evidence || [],
        repos
    }
}
