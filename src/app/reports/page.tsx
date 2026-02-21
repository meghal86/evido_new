import { Header } from '@/components/header';
import { ReportList } from '@/components/report-list';
import { getReports } from '@/app/actions/reports';
import { getReadinessScore } from '@/lib/readiness-server';
import { auth } from '@/auth';

export default async function ReportsPage() {
    const session = await auth();
    const [reports, readiness] = await Promise.all([
        getReports(),
        getReadinessScore(session?.user?.id || '')
    ]);

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="Final Evidence Report" progress={readiness} />
            <ReportList reports={reports} />
        </div>
    );
}
