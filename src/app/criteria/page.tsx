import { CriteriaDashboard } from '@/components/criteria-dashboard';
import { Header } from '@/components/header';
import { getCriteriaData } from '@/app/actions/criteria';

export default async function CriteriaPage() {
    const data = await getCriteriaData();

    const mappedCriteria = data ? {
        // We would map real evidence to the criteria list here
        // For now passing raw evidence or just letting dashboard render default
    } : undefined;

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="EB-1A Criteria Tracking" progress={60} />
            <CriteriaDashboard
                repos={data?.repos || []}
            />
        </div>
    );
}
