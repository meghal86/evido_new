import { NextResponse } from 'next/server'
import { auth } from '@/auth' // Changed from 'next-auth' to '@/auth' to work with v5
import { Octokit } from '@octokit/rest'

export async function GET() {
    const session = await auth()

    // @ts-ignore
    if (!session?.accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // @ts-ignore
    const octokit = new Octokit({ auth: session.accessToken })

    try {
        // Get user repos
        const { data: repos } = await octokit.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 100,
        })

        // Calculate stats
        const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0)
        const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0)
        const languages = repos.reduce((acc: Record<string, number>, repo: any) => {
            if (repo.language) {
                acc[repo.language] = (acc[repo.language] || 0) + 1
            }
            return acc
        }, {} as Record<string, number>)

        // Get top repo
        const topRepo = repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)[0]

        // Get commit count (approximate from contributions)
        const { data: user } = await octokit.users.getAuthenticated()

        return NextResponse.json({
            username: user.login,
            totalRepos: repos.length,
            totalStars,
            totalForks,
            topRepo: topRepo ? {
                name: topRepo.name,
                stars: topRepo.stargazers_count,
                description: topRepo.description,
                url: topRepo.html_url,
            } : null,
            languages: Object.entries(languages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
            profileUrl: user.html_url,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            company: user.company,
            location: user.location,
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,
        })
    } catch (error) {
        console.error('GitHub API error:', error)
        return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 })
    }
}
