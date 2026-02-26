import { NextResponse } from 'next/server'
import { auth } from '@/auth' // Changed from 'next-auth' to '@/auth' to work with v5
import { Octokit } from '@octokit/rest'
import { prisma } from '@/lib/prisma'
import { saveEvidenceRecord } from '@/app/actions/upload'

export async function GET() {
    const session = await auth()

    // @ts-expect-error - session.accessToken is not typed in next-auth by default
    if (!session?.accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // @ts-expect-error - session.accessToken is not typed in next-auth by default
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

        // ---------------------------------------------------------
        // HIGHLIGHT: High Impact Narrative Generation & Auto-Save
        // ---------------------------------------------------------
        const highImpactRepos = repos.filter((r: any) => r.stargazers_count >= 100)

        let impactNarrative = null;

        if (highImpactRepos.length > 0) {
            const sumHighImpactStars = highImpactRepos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0)
            impactNarrative = `Contributed to ${highImpactRepos.length} open source project(s) with ${sumHighImpactStars}+ total stars. Top project: ${highImpactRepos[0]?.name} (${highImpactRepos[0]?.stargazers_count} stars).`

            const userId = session?.user?.id;

            // Check if we already saved this to avoid duplicates
            if (userId) {
                const existingEvidence = await prisma.evidenceItem.findFirst({
                    where: {
                        userId: userId,
                        sourceType: 'GitHub',
                        criterionId: 'contributions',
                        title: 'GitHub Open Source Impact'
                    }
                })

                if (!existingEvidence) {
                    // Auto-save this as evidence
                    await saveEvidenceRecord({
                        title: 'GitHub Open Source Impact',
                        description: impactNarrative,
                        url: user.html_url,
                        filePath: '',
                        criterionId: 'contributions',
                        sourceType: 'GitHub',
                        sourceDate: new Date(),
                        metrics: {
                            highImpactRepoCount: highImpactRepos.length,
                            totalStars: sumHighImpactStars,
                            topRepo: highImpactRepos[0]?.name
                        }
                    })
                }
            }
        }

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
            impactNarrative // Send back to UI for visibility
        })
    } catch (error: any) {
        console.error('GitHub API error:', error.message || error)
        if (error.status === 401 && session?.user?.id) {
            try {
                const { prisma } = await import("@/lib/prisma");
                await prisma.account.deleteMany({
                    where: { userId: session.user.id, provider: 'github' }
                });
                console.log(`Unlinked invalid GitHub account for user ${session.user.id} in API route`);
            } catch (dbError) {
                console.error("Failed to unlink GitHub account:", dbError);
            }
        }
        return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 })
    }
}
