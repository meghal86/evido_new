
export const CRITERIA_IDS = [
    'awards', 'membership', 'published', 'judging', 'original',
    'authorship', 'leading', 'salary', 'artistic', 'commercial'
];

export interface CriterionStatus {
    id: string;
    count: number;
    status: 'Weak' | 'Medium' | 'Good' | 'Strong';
    points: number;
}

export function calculateCriteriaStatus(evidence: { criterionId: string }[]): CriterionStatus[] {
    const evidenceByCriterion: Record<string, number> = {};
    evidence.forEach((item) => {
        if (item.criterionId) {
            evidenceByCriterion[item.criterionId] = (evidenceByCriterion[item.criterionId] || 0) + 1;
        }
    });

    return CRITERIA_IDS.map(id => {
        const count = evidenceByCriterion[id] || 0;
        let status: CriterionStatus['status'] = 'Weak';
        let points = 0;

        if (count >= 3) {
            status = 'Strong';
            points = 3;
        } else if (count === 2) {
            status = 'Good';
            points = 2;
        } else if (count === 1) {
            status = 'Medium';
            points = 1;
        } else {
            status = 'Weak';
            points = 0;
        }

        return { id, count, status, points };
    });
}

export function calculateReadinessScore(criteriaStatus: CriterionStatus[], githubProfile?: any, userEmail?: string): number {
    const eb1aWeights: Record<string, number> = {
        awards: 1.2, membership: 0.8, published: 1, judging: 1,
        original: 1.5, authorship: 1.2, leading: 1.5, salary: 0.8,
        artistic: 0.2, commercial: 0.8
    };

    let score = 35; // Baseline

    // Add criteria scores
    for (const item of criteriaStatus) {
        const weight = eb1aWeights[item.id] || 1;
        if (item.status === 'Strong') score += 10 * weight;
        else if (item.status === 'Good') score += 6 * weight;
        else if (item.status === 'Medium') score += 3 * weight;
    }

    // Add Github bonus if provided
    if (githubProfile) {
        if (githubProfile.stats?.totalStars > 10000) score += 6;
        else if (githubProfile.stats?.totalStars > 1000) score += 4;

        const publicRepos = githubProfile.stats?.publicRepos || githubProfile.stats?.totalRepos || 0;
        if (publicRepos > 50) score += 3;
    }

    // Jitter for 0-state difference between visas
    const jitter = (userEmail?.length || 10) % 3;
    score += jitter;

    return Math.min(100, Math.max(0, Number(score.toFixed(1))));
}

// Keep the old function signature for backward compatibility if needed, 
// or remove it if we find all usages.
// The old one accepted `ReadinessData` which included connected accounts.
// The new requirement focuses on evidence points.
// We can hybridize: Base score from evidence + bonus from accounts?
// "Pull score from user's criteria data" - prompt implies primarily criteria.
// Let's rely on criteria for now as it's the core metric.
