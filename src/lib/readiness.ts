
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

export function calculateReadinessScore(criteriaStatus: CriterionStatus[]): number {
    const totalPoints = criteriaStatus.reduce((sum, item) => sum + item.points, 0);
    const maxPoints = 30; // 10 criteria * 3 points
    return Math.round((totalPoints / maxPoints) * 100);
}

// Keep the old function signature for backward compatibility if needed, 
// or remove it if we find all usages.
// The old one accepted `ReadinessData` which included connected accounts.
// The new requirement focuses on evidence points.
// We can hybridize: Base score from evidence + bonus from accounts?
// "Pull score from user's criteria data" - prompt implies primarily criteria.
// Let's rely on criteria for now as it's the core metric.
