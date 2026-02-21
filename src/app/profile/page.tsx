import { auth } from "@/auth";
import { getProfileData } from "@/app/actions/profile";
import { ProfilePreferences } from "@/components/profile-preferences";
import { Header } from '@/components/header';
import {
    Star, GitFork, FolderGit2, Activity,
    Building2, MapPin, Users, Calendar, Mail, Globe,
    ExternalLink, Github, Shield
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const data = await getProfileData();
    // @ts-ignore
    const error = data?.error;
    // @ts-ignore
    const githubConnected = data?.githubConnected || false;

    if (!data || error) {
        return (
            <div className="min-h-screen lg:pl-64 bg-[#f8fafc] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-slate-800">Profile Unavailable</h1>
                    <p className="text-slate-500 max-w-md mx-auto">
                        {error ? String(error) : "We couldn't load your profile data. Please try again."}
                    </p>
                    <a href="/" className="inline-block px-6 py-2 bg-[#1e3a8a] text-white rounded-xl">Go Home</a>
                </div>
            </div>
        );
    }

    // @ts-ignore
    const { user, github, visaScores } = data as any;

    const profile = github?.profile;
    const stats = github?.stats;
    const topRepos = github?.topRepos || [];

    return (
        <div className="min-h-screen lg:pl-64 bg-[#f8fafc]">
            <Header
                title="Profile Analytics"
                progress={githubConnected ? 60 : 30}
                breakdownData={data ? {
                    evidenceCount: 0,
                    letterCount: 0,
                    githubConnected: !!data.githubConnected,
                    linkedinConnected: false,
                    scholarConnected: false
                } : undefined}
            />

            <main className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* ═══════════════════════════════════════════════════════
                    HERO PROFILE CARD
                ═══════════════════════════════════════════════════════ */}
                <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(30,58,138,0.1)] group">
                    <div className="h-32 bg-[#1e3a8a] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(30,58,138,1)_0%,rgba(15,23,42,1)_100%)]" />
                        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                    </div>

                    <div className="px-10 pb-10 -mt-12 relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                            <div className="w-[100px] h-[100px] rounded-2xl bg-white border-4 border-white shadow-2xl overflow-hidden relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                {(profile?.avatarUrl || user.image) ? (
                                    <Image
                                        src={profile?.avatarUrl || user.image || ''}
                                        alt={profile?.name || user.name || 'User'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-slate-300">
                                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow pt-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight leading-none">
                                        {profile?.name || user.name || 'Evido User'}
                                    </h1>
                                    {githubConnected && (
                                        <div className="px-2 py-0.5 bg-blue-50 rounded-md border border-blue-100 flex items-center gap-1">
                                            <Shield className="w-3 h-3 text-blue-600 fill-blue-600" />
                                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Verified</span>
                                        </div>
                                    )}
                                </div>
                                {profile?.login && (
                                    <p className="text-blue-600 font-semibold text-sm mt-1.5 opacity-80">
                                        @{profile.login}
                                    </p>
                                )}
                            </div>

                            {profile?.htmlUrl && (
                                <a
                                    href={profile.htmlUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-100 bg-blue-50/50 text-[#1e3a8a] text-sm font-semibold hover:bg-blue-100 transition-all duration-300 hover:shadow-md"
                                >
                                    <Github className="w-4 h-4" />
                                    View GitHub
                                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                                </a>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8 pt-6 border-t border-slate-100/60 text-sm text-[#64748b]">
                            {profile?.joinedDate && (
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-900/40" />
                                    <span className="font-medium">Joined {profile.joinedDate}</span>
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="font-medium text-emerald-700">Active Candidate</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    STATISTICS DASHBOARD
                ═══════════════════════════════════════════════════════ */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={Star} value={stats.totalStars.toLocaleString()} label="Total Stars" />
                        <StatCard icon={GitFork} value={stats.totalForks.toLocaleString()} label="Total Forks" />
                        <StatCard icon={FolderGit2} value={stats.publicRepos.toString()} label="Public Repos" />
                        <StatCard icon={Activity} value={stats.contributions.toLocaleString()} label="Contributions" />
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    VISA READINESS OVERVIEW
                ═══════════════════════════════════════════════════════ */}
                <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-[#0f172a] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-[#1e3a8a]" />
                                </div>
                                Visa Readiness Overview
                            </h2>
                            <p className="text-sm text-slate-500 mt-2 max-w-lg">
                                AI-calculated probability based on your profile metrics, citation count, and evidence strength.
                            </p>
                        </div>
                        <Link href="/resources/guides/criteria-breakdown" className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest">
                            View Details
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <VisaScoreCard type="EB-1A" score={visaScores.eb1a.score} status={visaScores.eb1a.status} />
                        <VisaScoreCard type="O-1" score={visaScores.o1.score} status={visaScores.o1.status} />
                        <VisaScoreCard type="EB-2 NIW" score={visaScores.eb2niw.score} status={visaScores.eb2niw.status} />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ═══════════════════════════════════════════════════════
                        TOP REPOSITORIES
                    ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-2 space-y-6">
                        {topRepos.length > 0 && (
                            <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                                <h2 className="text-lg font-bold text-[#0f172a] mb-6">Top Repositories</h2>
                                <div className="space-y-4">
                                    {topRepos.map((repo: any) => (
                                        <div key={repo.name} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center gap-6 group hover:bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300">
                                            <div className="flex-grow min-w-0">
                                                <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-blue-900 transition-colors">{repo.name}</h3>
                                                <p className="text-xs text-[#64748b] mt-1 line-clamp-1">{repo.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0 text-xs font-medium">
                                                <span className="flex items-center gap-1.5 text-slate-600">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    {repo.stars}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-400">
                                                    <GitFork className="w-3.5 h-3.5" />
                                                    {repo.forks}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        PREFERENCES
                    ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-1">
                        <ProfilePreferences />
                    </div>
                </div>

            </main>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────────────────────────────────── */

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-5 h-5 text-[#1e3a8a]" />
            </div>
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">{value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 leading-none">{label}</div>
        </div>
    );
}

function VisaScoreCard({ type, score, status }: { type: string; score: number; status: string }) {
    const getScoreColor = () => {
        if (score >= 85) return 'text-emerald-600';
        if (score >= 70) return 'text-amber-500';
        if (score >= 50) return 'text-[#d97706]';
        return 'text-slate-400';
    };

    const getBadgeStyle = () => {
        if (score >= 85) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100';
        if (score >= 70) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100';
        if (score >= 50) return 'bg-orange-50 text-orange-700 ring-1 ring-orange-100';
        return 'bg-slate-50 text-slate-500 ring-1 ring-slate-100';
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 text-center hover:bg-white hover:shadow-xl hover:shadow-blue-900/[0.02] transition-all duration-500 group">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 group-hover:text-blue-900 transition-colors">
                {type}
            </div>
            <div className={`text-5xl font-black tracking-tighter mb-5 transition-transform duration-500 group-hover:scale-110 ${getScoreColor()}`}>
                {score}
            </div>
            <span className={`inline-block text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${getBadgeStyle()}`}>
                {status}
            </span>
        </div>
    );
}

function LanguageBadge({ language }: { language: string }) {
    const colorMap: Record<string, string> = {
        'TypeScript': 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
        'JavaScript': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100',
        'Python': 'bg-green-50 text-green-700 ring-1 ring-green-100',
        'Rust': 'bg-orange-50 text-orange-800 ring-1 ring-orange-200',
        'Go': 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100',
        'Java': 'bg-red-50 text-red-700 ring-1 ring-red-100',
        'C++': 'bg-purple-50 text-purple-700 ring-1 ring-purple-100',
        'C#': 'bg-violet-50 text-violet-700 ring-1 ring-violet-100',
        'Ruby': 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
        'Swift': 'bg-orange-50 text-orange-700 ring-1 ring-orange-100',
        'Kotlin': 'bg-purple-50 text-purple-700 ring-1 ring-purple-100',
        'PHP': 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
    };

    const style = colorMap[language] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';

    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${style}`}>
            {language}
        </span>
    );
}
