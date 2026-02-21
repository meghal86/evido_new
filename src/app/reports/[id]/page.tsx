
import { Header } from '@/components/header';
import { ReportPreview } from '@/components/report-preview';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ReportDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user?.id) redirect('/landing');

    const report = await prisma.report.findUnique({
        where: { id: params.id }
    });

    if (!report || report.userId !== session.user.id) {
        redirect('/reports');
    }

    return (
        <div className="min-h-screen lg:pl-64 print:pl-0">
            <div className="print:hidden">
                <Header title="Report Detail" progress={report.score} />
            </div>
            <ReportPreview initialReport={report} />
        </div>
    );
}
