import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { PLAN_LEVELS } from "@/lib/plans";

import { InviteForm } from "@/components/team/invite-form";
import { TeamTable } from "@/components/team/team-table";
import { PermissionsPanel } from "@/components/team/permissions-panel";
import { ActivityLog } from "@/components/team/activity-log";

import { Lock, Shield, Users, ArrowUpRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function TeamPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/landing");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true, name: true, email: true },
    });

    const userEmail = user?.email || "";

    const userPlan = user?.plan || "Free";
    const planLevel = PLAN_LEVELS[userPlan] ?? 0;
    const canAccess = planLevel >= PLAN_LEVELS["Premium"];
    const isEnterprise = planLevel >= PLAN_LEVELS["Enterprise"];

    // Fetch team data
    const members = canAccess
        ? await prisma.teamMember.findMany({
            where: { caseOwnerId: session.user.id, status: { not: "inactive" } },
            orderBy: { createdAt: "desc" },
        })
        : [];

    const logs = canAccess
        ? await prisma.teamActivityLog.findMany({
            where: {
                caseOwnerId: session.user.id,
                createdAt: {
                    gte: new Date(
                        Date.now() - (isEnterprise ? 365 : 30) * 24 * 60 * 60 * 1000
                    ),
                },
            },
            include: { teamMember: { select: { invitedEmail: true, role: true } } },
            orderBy: { createdAt: "desc" },
            take: 50,
        })
        : [];

    // Get default permissions from first member or defaults
    const defaultPermissions = members[0]?.permissions as any || {
        view_case: true,
        download_evidence: true,
        email_notifications: true,
        edit_criteria: false,
        generate_reports: false,
    };

    // ─── Free / Basic Teaser ─────────────────────────────────────
    if (!canAccess) {
        return (
            <div className="min-h-screen lg:pl-64 bg-[#f8fafc]">
                <Header title="Team Collaboration" />

                <main className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-[#0f172a] tracking-tight mb-2">
                            Team Collaboration
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Invite immigration attorneys and reviewers to collaborate on your case.
                        </p>
                    </div>

                    {/* Upgrade Teaser Card */}
                    <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 relative overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-[6rem] -mr-8 -mt-8 pointer-events-none" />

                        <div className="flex flex-col items-center text-center max-w-lg mx-auto relative z-10">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/20">
                                <Users className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="text-2xl font-black text-[#0f172a] mb-3">
                                Collaborate with Your Attorney
                            </h2>
                            <p className="text-sm text-slate-500 leading-relaxed mb-8">
                                Invite immigration professionals to review your evidence and provide expert guidance. Securely share your case with attorney-client privilege protection.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
                                {[
                                    { icon: Shield, label: "Secure attorney-client privilege" },
                                    { icon: Users, label: "Real-time case sharing" },
                                    { icon: CheckCircle, label: "Activity audit logs" },
                                ].map((feature, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <feature.icon className="w-5 h-5 text-[#1e3a8a]" />
                                        <span className="text-xs font-bold text-slate-600 text-center">{feature.label}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/upgrade"
                                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
                            >
                                Upgrade to Premium — $299
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    // ─── Premium / Enterprise Full View ──────────────────────────
    return (
        <div className="min-h-screen lg:pl-64 bg-[#f8fafc]">
            <Header title="Team Collaboration" />

            <main className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-[1000px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                    <h1 className="text-3xl font-black text-[#0f172a] tracking-tight mb-2">
                        Team Collaboration
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Invite immigration attorneys and reviewers to collaborate on your case.
                    </p>
                </div>

                {/* Section 1: Invite Form */}
                <InviteForm userPlan={userPlan} memberCount={members.length} currentUserEmail={userEmail} />

                {/* Section 2: Team Members Table */}
                <TeamTable members={members as any} canInvite={canAccess} />

                {/* Section 3: Permissions Panel */}
                <PermissionsPanel
                    userPlan={userPlan}
                    initialPermissions={defaultPermissions}
                    hasMembers={members.length > 0}
                />

                {/* Section 4: Activity Log */}
                {members.length > 0 && (
                    <ActivityLog logs={logs as any} isEnterprise={isEnterprise} />
                )}
            </main>
        </div>
    );
}
