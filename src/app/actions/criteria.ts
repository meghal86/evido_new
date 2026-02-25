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

    // Calculate Criteria Status
    const evidenceByCriterion: Record<string, number> = {};
    user.evidence.forEach((item: any) => {
        if (item.criterionId) {
            evidenceByCriterion[item.criterionId] = (evidenceByCriterion[item.criterionId] || 0) + 1;
        }
    });

    const criteriaIds = [
        'awards', 'membership', 'published', 'judging', 'original',
        'authorship', 'leading', 'salary', 'artistic', 'commercial'
    ];

    let strongCount = 0;
    const criteriaStatus = criteriaIds.map(id => {
        const count = evidenceByCriterion[id] || 0;
        let status = 'Weak';
        let color = 'red';

        if (count >= 3) {
            status = 'Strong';
            color = 'emerald';
            strongCount++;
        } else if (count === 2) {
            status = 'Good';
            color = 'blue';
        } else if (count === 1) {
            status = 'Medium';
            color = 'amber';
        }

        // Generate dynamic text text
        let countText = count > 0 ? `${count} piece${count > 1 ? 's' : ''} of evidence` : 'Add evidence';

        return { id, count, status, color, countText };
    });

    const readinessScore = Math.round((strongCount / 10) * 100);

    // Create chart data
    const chartData = [
        { name: 'Strong', value: criteriaStatus.filter(c => c.status === 'Strong').length, color: '#10b981' },
        { name: 'Good', value: criteriaStatus.filter(c => c.status === 'Good').length, color: '#3b82f6' },
        { name: 'Medium', value: criteriaStatus.filter(c => c.status === 'Medium').length, color: '#f59e0b' },
        { name: 'Weak', value: criteriaStatus.filter(c => c.status === 'Weak').length, color: '#ef4444' },
    ];

    return {
        evidenceCount: user.evidence.length || 0,
        evidence: user.evidence || [],
        repos,
        criteriaStatus,
        chartData,
        readinessScore,
        strongCount
    }
}
