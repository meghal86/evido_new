import { Header } from '@/components/header';
import { getDashboardData } from '@/app/actions/dashboard';
import { PaymentSuccessMessage } from '@/components/payment-success-message';
import { ReadinessGauge } from '@/components/dashboard/readiness-gauge';
import { TopGaps } from '@/components/dashboard/top-gaps';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { AITip } from '@/components/dashboard/ai-tip';
import { GetStarted } from '@/components/dashboard/get-started';
import { PLAN_LEVELS } from '@/lib/plans';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Dashboard(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Role-based redirect: attorneys go to their cases dashboard
  const session = await auth();
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, onboardingComplete: true }
    });
    if (user?.role === 'attorney') redirect('/attorney/cases');
    if (user && !user.onboardingComplete) {
      const onboardingRole = (user.role === 'attorney') ? 'attorney' : 'petitioner';
      redirect(`/onboarding/${onboardingRole}`);
    }
  }

  const searchParams = await props.searchParams;
  const paymentStatus = searchParams.payment_status;

  const data = await getDashboardData();

  // Default values if data load fails or first time
  const readinessScore = data?.readinessScore || 0;
  const criteriaStatus = data?.criteriaStatus || [];

  // Filter for gaps (Weak/Medium)
  const gaps = criteriaStatus
    .filter(c => c.status === 'Weak' || c.status === 'Medium')
    .sort((a, b) => {
      // Sort Weak first, then Medium
      if (a.status === 'Weak' && b.status !== 'Weak') return -1;
      if (a.status !== 'Weak' && b.status === 'Weak') return 1;
      return 0;
    });

  const userPlan = data?.user?.plan || 'Free';
  const isPremium = (PLAN_LEVELS[userPlan] || 0) >= PLAN_LEVELS['Premium'];

  return (
    <div className="min-h-screen lg:pl-64 bg-slate-50 dark:bg-slate-950 pb-20">
      {paymentStatus === 'success' && <PaymentSuccessMessage />}

      <Header
        title="Case Overview"
        progress={readinessScore}
        breakdownData={{
          evidenceCount: data?.counts?.evidence || 0,
          letterCount: data?.counts?.letters || 0,
          githubConnected: data?.connections?.github || false,
          linkedinConnected: false,
          scholarConnected: false
        }}
      />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 pt-32 lg:pt-28 pb-8 space-y-8 animate-in fade-in duration-700">

        {/* AI Tip Banner - Contextual */}
        {gaps.length > 0 && <AITip gap={gaps[0]} />}

        {/* Onboarding / Get Started - Only show if readiness is very low */}
        {readinessScore < 10 && (
          <GetStarted
            githubConnected={data?.connections?.github || false}
            evidenceCount={data?.counts?.evidence || 0}
          />
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ReadinessGauge score={readinessScore} />
            </div>
            <div className="md:col-span-2">
              <TopGaps gaps={gaps} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <QuickActions isPremium={isPremium} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivity activities={[]} />
            {/* Placeholder for future or just empty for now */}
          </div>
        </div>

      </main>
    </div>
  );
}
