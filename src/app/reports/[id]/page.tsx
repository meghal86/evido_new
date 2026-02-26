
import { Header } from '@/components/header';
import { ReportPreview } from '@/components/report-preview';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getDashboardData } from '@/app/actions/dashboard'; // Added

export default async function ReportDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user?.id) redirect('/landing');

    const [report, dashboardData] = await Promise.all([
        prisma.report.findUnique({
            where: { id: params.id }
        }),
        getDashboardData()
    ]);

    if (!report || report.userId !== session.user.id) {
        redirect('/reports');
    }

    const liveReadiness = dashboardData?.readinessScore || 0;

    return (
        <div className="min-h-screen lg:pl-64 print:pl-0">
            <div className="print:hidden">
                <Header title="Report Detail" progress={liveReadiness} />
            </div>
            <ReportPreview initialReport={report} liveScore={liveReadiness} />
        </div>
    );
}
