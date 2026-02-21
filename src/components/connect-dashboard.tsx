'use client';

import React from 'react';
import { Github, Linkedin, GraduationCap, FileUp, CheckCircle2, ChevronRight, Unlink } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ReadinessBreakdown } from './readiness-breakdown';
import { calculateReadinessScore as calculateReadiness } from '@/lib/readiness';

interface ConnectDashboardProps {
    initialConnections?: Record<string, boolean>;
    githubStats?: any;
    missingActions?: Array<{ id: string, label: string, href: string }>;
    counts?: { evidence: number; letters: number };
}

export const ConnectDashboard: React.FC<ConnectDashboardProps> = ({
    initialConnections = { github: false, linkedin: false, scholar: false },
    githubStats,
    missingActions = [],
    counts = { evidence: 0, letters: 0 }
}) => {
    const [connections, setConnections] = React.useState(initialConnections);
    const [showBreakdown, setShowBreakdown] = React.useState(false);
    const router = useRouter();

    const handleToggle = (id: string) => {
        if (id === 'github') {
            if (!connections.github) {
                import('next-auth/react').then(({ signIn }) => signIn('github', { callbackUrl: '/' }));
            } else {
                import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/' }));
            }
        }
    };

    // Simple score calculation based on connected sources and evidence
    const calculateScore = () => {
        let score = 0;
        if (connections.github) score += 25;
        if (connections.linkedin) score += 15;
        if (connections.scholar) score += 10;
        score += Math.min(counts.evidence * 5, 30);
        score += Math.min(counts.letters * 10, 20);
        return Math.min(score, 100);
    };

    return (
        <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <ReadinessBreakdown
                isOpen={showBreakdown}
                onClose={() => setShowBreakdown(false)}
                score={calculateScore()}
                evidenceCount={counts.evidence}
                letterCount={counts.letters}
                githubConnected={connections.github}
                linkedinConnected={connections.linkedin}
                scholarConnected={connections.scholar}
            />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black text-[#0f172a] tracking-tight leading-tight">Evidence Sources</h2>
                        <button
                            onClick={() => setShowBreakdown(true)}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                            View Score Breakdown
                        </button>
                    </div>
                    <p className="text-slate-500 font-medium max-w-md">Connect your professional profiles to automatically generate your extraordinary ability evidence.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-2xl bg-white/50 border border-slate-200/50 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Sync Active</span>
                    </div>
                </div>
            </div>

            {/* What's Missing Callout (P0 Feature) */}
            {missingActions.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="space-y-4 flex-grow">
                            <div>
                                <h3 className="text-lg font-black text-[#0f172a]">What's Missing?</h3>
                                <p className="text-sm text-slate-500 font-medium">Complete these steps to improve your readiness score.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {missingActions.slice(0, 4).map(action => (
                                    <button
                                        key={action.id}
                                        onClick={() => router.push(action.href)}
                                        className="flex items-center justify-between px-4 py-3 bg-white border border-amber-200/50 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all text-left group"
                                    >
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-amber-700 transition-colors">{action.label}</span>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GitHub Card */}
                <ConnectionCard
                    icon={<Github className="w-8 h-8" />}
                    title="GitHub"
                    status={connections.github ? 'connected' : 'not_connected'}
                    details={connections.github ? "Actively syncing repositories and contribution data." : "Sync your technical portfolio and open-source contributions."}
                    actionLabel={connections.github ? "Manage Connection" : "Link GitHub"}
                    onAction={() => handleToggle('github')}
                    isPrimary={!connections.github}
                    stats={githubStats ? `${githubStats.totalRepos} Repos • ${githubStats.totalStars} Stars` : undefined}
                />

                {/* LinkedIn Card */}
                <ConnectionCard
                    icon={<Linkedin className="w-8 h-8 text-[#0077b5]" />}
                    title="LinkedIn"
                    status={connections.linkedin ? 'connected' : 'not_connected'}
                    details="Directly import your professional history, roles, and scholarly endorsements."
                    actionLabel="Link LinkedIn"
                    onAction={() => handleToggle('linkedin')}
                    isPrimary={false}
                />

                {/* Google Scholar Card */}
                <ConnectionCard
                    icon={<GraduationCap className="w-8 h-8 text-blue-600" />}
                    title="Google Scholar"
                    status={connections.scholar ? 'connected' : 'not_connected'}
                    details="Automate the tracking of your citations, publications, and scientific impact."
                    actionLabel="Link Scholar"
                    onAction={() => handleToggle('scholar')}
                    isPrimary={false}
                />

                {/* Manual Upload Card */}
                <ConnectionCard
                    icon={<FileUp className="w-8 h-8 text-slate-500" />}
                    title="Documentation"
                    status="active"
                    details="Securely upload PDFs of awards, memberships, and expert testimonials."
                    actionLabel="Browse Gallery"
                    onAction={() => router.push('/upload')}
                    isPrimary={true}
                />
            </div>

            <div className="pt-8 flex flex-col items-center gap-6">
                <button
                    onClick={() => router.push('/criteria')}
                    className="group relative px-12 py-5 bg-[#1e3a8a] text-white text-base font-black rounded-[2rem] shadow-2xl shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1 active:scale-95 transition-all duration-500 flex items-center gap-4 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10">Proceed to Analysis</span>
                    <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ready to evaluate 10 criteria</p>
            </div>
        </div>
    );
};

interface ConnectionCardProps {
    icon: React.ReactNode;
    title: string;
    status: 'connected' | 'not_connected' | 'active';
    details: string;
    actionLabel: string;
    onAction: () => void;
    isPrimary: boolean;
    stats?: string;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ icon, title, status, details, actionLabel, onAction, isPrimary, stats }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass rounded-[2rem] p-8 flex flex-col h-full hover:premium-shadow transition-all duration-500 group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-8">
            {status === 'connected' ? (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm animate-in fade-in zoom-in duration-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                </div>
            ) : status === 'active' && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                    Active
                </div>
            )}
        </div>

        <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                {icon}
            </div>
        </div>

        <div className="space-y-3 flex-grow">
            <h3 className="text-xl font-black text-[#0f172a] tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px]">{details}</p>
            {stats && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-50/50 rounded-lg border border-blue-100/50 text-[11px] font-bold text-blue-900/60 mt-2">
                    {stats}
                </div>
            )}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100/50 flex items-center justify-between">
            {status === 'connected' ? (
                <button
                    onClick={onAction}
                    className="text-[11px] font-black text-slate-400 hover:text-red-500 flex items-center gap-2 transition-all duration-300 uppercase tracking-widest group/btn"
                >
                    <Unlink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                    Disconnect
                </button>
            ) : (
                <button
                    onClick={onAction}
                    className={`px-8 py-3 rounded-xl text-[13px] font-black transition-all duration-300 active-click ${isPrimary
                        ? 'bg-[#1e3a8a] text-white hover:bg-[#1e40af] shadow-lg shadow-blue-500/10'
                        : 'bg-slate-100 text-[#0f172a] hover:bg-slate-200'
                        }`}
                >
                    {actionLabel}
                </button>
            )}

            {status === 'connected' && title === 'GitHub' && (
                <button
                    onClick={() => window.location.href = '/connect/github'}
                    className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all active-click shadow-sm"
                    title="View Repositories"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    </motion.div>
);
