import { auth } from "@/auth";
import { getUserRepos } from "@/lib/github";
import { prisma } from "@/lib/prisma";
import { Header } from '@/components/header';
import { CriterionDetail } from '@/components/criterion-detail';
import { CitationImpactChart } from '@/components/citation-impact-chart';

export default async function CriterionDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await auth();
    let topRepo = null;
    let allRepos = [];

    // Fetch evidence items from DB
    const evidenceItemsRaw = session?.user?.id ? await prisma.evidenceItem.findMany({
        where: {
            userId: session.user.id,
            criterionId: params.id
        },
        include: {
            auditLogs: {
                orderBy: { timestamp: 'desc' }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    }) : [];

    // Check if current user is an attorney
    let isAttorney = false;
    try {
        const currentUser = session?.user?.id ? await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, name: true, role: true }
        }) : null;
        isAttorney = currentUser?.role === 'attorney';
    } catch (error) {
        console.error("Prisma Role Check Error:", error);
        // Fallback or ignore for now to prevent page crash
    }

    // Map to EvidenceItemProps
    const evidenceItems = evidenceItemsRaw.map(item => ({
        id: item.id,
        exhibitId: item.exhibitId,
        title: item.title,
        description: item.description,
        sourceType: item.sourceType,
        sourceDate: item.sourceDate,
        metrics: item.metrics as any,
        attorneyStatus: item.attorneyStatus,
        locked: item.locked,
        auditLogs: item.auditLogs
    }));

    // Only fetch for "original" contributions criterion and if logged in
    if (params.id === 'original' && session?.user?.id) {
        // @ts-ignore
        const token = session.accessToken || (
            await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { accounts: true }
            })
        )?.accounts.find((a: any) => a.provider === 'github')?.access_token;

        if (token) {
            allRepos = await getUserRepos(token, session.user.id);
            // Sort by stars descending
            if (allRepos.length > 0) {
                topRepo = allRepos.sort((a: any, b: any) => (b.stars || 0) - (a.stars || 0))[0];
            }
        }
    }

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="Criterion Analysis" progress={65} />
            {(params.id === 'published_material' || params.id === 'scholarly_articles') && (
                <div className="pt-32 lg:pt-28 px-4 lg:px-8 max-w-5xl mx-auto">
                    <CitationImpactChart />
                </div>
            )}
            <CriterionDetail
                criterionId={params.id}
                topRepo={topRepo}
                evidenceItems={evidenceItems}
                isAttorney={isAttorney}
            />
        </div>
    );
}
