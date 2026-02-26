import { Header } from '@/components/header';
import { ReportList } from '@/components/report-list';
import { getReports } from '@/app/actions/reports';
import { getDashboardData } from '@/app/actions/dashboard';

export default async function ReportsPage() {
    const [reports, dashboardData] = await Promise.all([
        getReports(),
        getDashboardData()
    ]);

    const readiness = dashboardData?.readinessScore || 0;

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="Final Evidence Report" progress={readiness} />
            <ReportList reports={reports} />
        </div>
    );
}
