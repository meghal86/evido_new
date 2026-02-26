import { Octokit } from "octokit";

export async function getGitHubStats(accessToken: string, userId?: string) {
    const octokit = new Octokit({ auth: accessToken });

    try {
        const { data: user } = await octokit.rest.users.getAuthenticated();

        // Fetch more repos for accurate stats
        const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
            sort: "updated",
            per_page: 100, // Fetch up to 100 for better stats
            visibility: "all",
            affiliation: "owner,collaborator,organization_member"
        });

        const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);

        return {
            username: user.login,
            totalRepos: repos.length, // Use actual fetched count which includes private
            totalStars: totalStars,
            recentRepos: repos.slice(0, 5).map(r => ({
                name: r.name,
                stars: r.stargazers_count,
                url: r.html_url
            }))
        };
    } catch (error: any) {
        console.error("GitHub API Error:", error.message || error);
        if (error.status === 401 && userId) {
            try {
                const { prisma } = await import("@/lib/prisma");
                await prisma.account.deleteMany({
                    where: { userId, provider: 'github' }
                });
                console.log(`Unlinked invalid GitHub account for user ${userId}`);
            } catch (dbError) {
                console.error("Failed to unlink GitHub account:", dbError);
            }
        }
        return null;
    }
}

export async function getUserRepos(accessToken: string, userId?: string) {
    if (!accessToken) return [];

    const octokit = new Octokit({ auth: accessToken });
    try {
        const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
            sort: "updated",
            per_page: 100,
            visibility: "all"
        });

        return repos.map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [], // Include topics
            url: repo.html_url,
            created_at: repo.created_at,
            category: (repo.stargazers_count || 0) > 50 ? "High Impact" :
                repo.fork ? "Contribution" : "Original Work"
        }));
    } catch (error: any) {
        console.error("GitHub API Error:", error.message || error);
        if (error.status === 401 && userId) {
            try {
                const { prisma } = await import("@/lib/prisma");
                await prisma.account.deleteMany({
                    where: { userId, provider: 'github' }
                });
                console.log(`Unlinked invalid GitHub account for user ${userId}`);
            } catch (dbError) {
                console.error("Failed to unlink GitHub account:", dbError);
            }
        }
        return [];
    }
}

export async function getFullGitHubProfile(accessToken: string, userId?: string) {
    const octokit = new Octokit({ auth: accessToken });

    try {
        const { data: user } = await octokit.rest.users.getAuthenticated();

        // Paginate all repos for accurate aggregate stats
        const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
            sort: "updated",
            direction: "desc",
            per_page: 100,
            visibility: "public",
            affiliation: "owner"
        });

        const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);
        const totalForks = repos.reduce((sum: number, repo: any) => sum + (repo.forks_count || 0), 0);

        // Top 5 repos by stars
        const topRepos = repos
            .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
            .slice(0, 5)
            .map((repo: any) => ({
                name: repo.name,
                description: repo.description || "No description",
                stars: repo.stargazers_count || 0,
                forks: repo.forks_count || 0,
                language: repo.language || "Unknown",
                url: repo.html_url,
            }));

        return {
            profile: {
                name: user.name || user.login,
                login: user.login,
                avatarUrl: user.avatar_url,
                bio: user.bio || "",
                company: user.company || "",
                location: user.location || "",
                followers: user.followers || 0,
                following: user.following || 0,
                joinedDate: new Date(user.created_at).getFullYear().toString(),
                email: user.email || "",
                website: user.blog || "",
                htmlUrl: user.html_url,
            },
            stats: {
                totalStars,
                totalForks,
                publicRepos: user.public_repos || repos.length,
                contributions: (user.public_repos || 0) + (user.public_gists || 0) + totalStars,
            },
            topRepos,
        };
    } catch (error: any) {
        console.error("GitHub Profile API Error:", error.message || error);
        if (error.status === 401 && userId) {
            try {
                const { prisma } = await import("@/lib/prisma");
                await prisma.account.deleteMany({
                    where: { userId, provider: 'github' }
                });
                console.log(`Unlinked invalid GitHub account for user ${userId}`);
            } catch (dbError) {
                console.error("Failed to unlink GitHub account:", dbError);
            }
        }
        return null;
    }
}
