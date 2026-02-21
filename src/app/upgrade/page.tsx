import { Header } from '@/components/header';
import { UpgradePlans } from '@/components/upgrade-plans';
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function UpgradePage() {
    const session = await auth();
    let userPlan = "Free";

    if (session?.user?.id) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { plan: true }
            });
            if (user?.plan) userPlan = user.plan;
        } catch (e) {
            console.error("Failed to fetch user plan", e);
        }
    }

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="Select Your Plan" progress={50} />
            <UpgradePlans userPlan={userPlan} />
        </div>
    );
}
