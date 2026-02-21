export const PLAN_LEVELS: Record<string, number> = {
    'Free': 0,
    'Basic': 1,
    'Premium': 2,
    'Enterprise': 3
};

export const NEXT_PLAN: Record<string, string> = {
    'Free': 'Basic',
    'Basic': 'Premium',
    'Premium': 'Enterprise',
    'Enterprise': 'Enterprise'
};

export const FEATURES = {
    CRITERIA_ANALYSIS: 'Basic',
    AI_TEXT_GEN: 'Basic',
    DRAFT_REPORTS: 'Basic',

    EXPERT_LETTERS: 'Premium',
    GITHUB_SYNC: 'Premium',
    EXPERT_REVIEW: 'Premium',

    TEAM_MANAGEMENT: 'Enterprise',
    WHITE_LABEL_REPORTS: 'Enterprise',
};

export function hasAccess(userPlan: string | undefined | null, requiredPlan: string): boolean {
    const start = PLAN_LEVELS[userPlan || 'Free'] ?? 0;
    const target = PLAN_LEVELS[requiredPlan] ?? 99;
    return start >= target;
}
