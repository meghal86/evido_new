import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAttorneyCases } from "@/app/actions/attorney-cases";
import {
    Briefcase, FileText, Clock, CheckCircle, Copy,
    ArrowRight, Plus, Search, Scale, Users
} from "lucide-react";

export default async function AttorneyCasesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, name: true, attorneyData: true }
    });

    if (user?.role !== 'attorney') {
        redirect('/');
    }

    const { cases, error } = await getAttorneyCases();

    const activeCases = cases?.filter(c => c.status === 'active') || [];
    const pendingCases = cases?.filter(c => c.status === 'pending') || [];
    const totalPending = cases?.reduce((acc, c) => acc + c.pendingReview, 0) || 0;
    const totalEvidence = cases?.reduce((acc, c) => acc + c.totalEvidence, 0) || 0;

    return (
        <div className="min-h-screen lg:pl-64 bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] px-6 lg:px-8 py-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center">
                            <Scale className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white">My Cases</h1>
                            <p className="text-blue-200/60 text-sm font-medium">Welcome back, {user?.name || 'Attorney'}</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-3xl font-black text-white">{cases?.length || 0}</p>
                            <p className="text-xs font-bold text-blue-200/50 uppercase tracking-wider mt-1">Total Cases</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-3xl font-black text-amber-400">{activeCases.length}</p>
                            <p className="text-xs font-bold text-blue-200/50 uppercase tracking-wider mt-1">Active</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-3xl font-black text-blue-300">{totalPending}</p>
                            <p className="text-xs font-bold text-blue-200/50 uppercase tracking-wider mt-1">Pending Review</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-3xl font-black text-emerald-400">{totalEvidence}</p>
                            <p className="text-xs font-bold text-blue-200/50 uppercase tracking-wider mt-1">Total Evidence</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
                {(!cases || cases.length === 0) ? (
                    /* Empty State */
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-10 h-10 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-black text-[#0f172a] mb-2">No cases yet</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                            Clients using Evido will invite you to collaborate on their visa petitions. Share your attorney link to get started.
                        </p>
                        <div className="flex flex-col items-center gap-3">
                            <button
                                className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold text-sm rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                            >
                                <Copy className="w-4 h-4" />
                                Copy My Attorney Link
                            </button>
                            <p className="text-xs text-slate-400">
                                Share this link with clients so they can invite you to their case.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Cases Grid */
                    <div className="space-y-6">
                        {/* Active Cases */}
                        {activeCases.length > 0 && (
                            <div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    Active Cases
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activeCases.map(c => (
                                        <CaseCard key={c.id} caseData={c} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pending Cases */}
                        {pendingCases.length > 0 && (
                            <div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                    Pending Invitations
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pendingCases.map(c => (
                                        <CaseCard key={c.id} caseData={c} isPending />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}


function CaseCard({ caseData, isPending = false }: { caseData: any; isPending?: boolean }) {
    const initials = caseData.clientName
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??';

    return (
        <div className={`bg-white rounded-2xl shadow-sm border transition-all hover:shadow-lg hover:-translate-y-0.5 group ${isPending ? 'border-amber-200' : 'border-slate-100'
            }`}>
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-blue-800 flex items-center justify-center text-white text-sm font-black">
                            {initials}
                        </div>
                        <div>
                            <p className="text-sm font-black text-[#0f172a]">{caseData.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{caseData.clientEmail}</p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isPending
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                        {isPending ? 'Pending' : 'Active'}
                    </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-100">
                        {caseData.targetVisa}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                        <p className="text-lg font-black text-[#0f172a]">{caseData.totalEvidence}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Evidence</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-black text-amber-500">{caseData.pendingReview}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">To Review</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-black text-emerald-500">{caseData.readiness}%</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Ready</p>
                    </div>
                </div>

                {/* Readiness bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-gradient-to-r from-[#1e3a8a] to-blue-500 rounded-full transition-all"
                        style={{ width: `${caseData.readiness}%` }}
                    />
                </div>

                {isPending ? (
                    <div className="flex gap-2">
                        <button className="flex-1 py-2.5 bg-amber-500 text-white text-xs font-black rounded-xl hover:bg-amber-600 transition-all text-center">
                            Accept
                        </button>
                        <button className="flex-1 py-2.5 bg-slate-100 text-slate-500 text-xs font-black rounded-xl hover:bg-slate-200 transition-all text-center">
                            Decline
                        </button>
                    </div>
                ) : (
                    <a
                        href={`/attorney/cases/${caseData.clientId}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all group"
                    >
                        Review Case
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                )}
            </div>
        </div>
    );
}
