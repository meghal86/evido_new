export interface Repo {
    name: string;
    description?: string | null;
    stars?: number;
    language?: string | null;
    topics?: string[];
    url?: string;
    created_at?: string | null;
}

export const getCriteriaForRepo = (repo: Repo): string[] => {
    const criteria: string[] = [];
    const topics = repo.topics || [];
    const stars = repo.stars || 0;

    // Criterion 5: Original Contributions (High impact code)
    if (stars > 50) {
        criteria.push('original');
    }

    // Criterion 1: Awards (Hackathon wins, etc.)
    if (topics.includes('award') || topics.includes('hackathon') || topics.includes('winner')) {
        criteria.push('awards');
    }

    // Criterion 6: Authorship (Scholarly articles or major technical blogs/docs)
    // Using language as a weak proxy or specific topics
    if (topics.includes('paper') || topics.includes('research') || topics.includes('publication')) {
        criteria.push('authorship');
    }

    // Criterion 8: High Salary (Proxy: Commercial success or acquired projects)
    if (topics.includes('startup') || topics.includes('acquired')) {
        criteria.push('salary');
    }

    // Default fallback if it has some traction
    if (criteria.length === 0) {
        criteria.push('original'); // Map everything to 'original' for now to ensure visibility
    }

    return criteria;
};
