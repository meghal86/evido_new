import { CriteriaDashboard } from '@/components/criteria-dashboard';
import { Header } from '@/components/header';
import { getCriteriaData } from '@/app/actions/criteria';

export default async function CriteriaPage() {
    const data = await getCriteriaData();

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="EB-1A Criteria Tracking" progress={data?.readinessScore || 0} />
            <CriteriaDashboard
                repos={data?.repos || []}
                criteriaStatus={data?.criteriaStatus}
                chartData={data?.chartData}
                strongCount={data?.strongCount || 0}
            />
        </div>
    );
}
