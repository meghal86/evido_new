'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReadinessBreakdown } from './readiness-breakdown';

interface HeaderProps {
    title: string;
    progress?: number;
    breakdownData?: {
        evidenceCount: number;
        letterCount: number;
        githubConnected: boolean;
        linkedinConnected: boolean;
        scholarConnected: boolean;
    };
}

export const Header: React.FC<HeaderProps> = ({ title, progress, breakdownData }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isBreakdownOpen, setIsBreakdownOpen] = React.useState(false);
    const isGlobalSync = breakdownData?.githubConnected || breakdownData?.linkedinConnected;

    const userName = session?.user?.name || session?.user?.email || 'User';
    const initials = (userName === 'test user' ? 'TU' : userName).substring(0, 2).toUpperCase();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-8 fixed top-16 lg:top-0 right-0 left-0 lg:left-64 z-30 transition-all duration-300">
            {breakdownData && progress !== undefined && (
                <ReadinessBreakdown
                    isOpen={isBreakdownOpen}
                    onClose={() => setIsBreakdownOpen(false)}
                    score={progress}
                    {...breakdownData}
                />
            )}

            <div className="flex flex-col">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-black text-[#0f172a] tracking-tight">{title}</h1>
                    {isGlobalSync && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse relative">
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Global Sync Active</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
                </div>
            </div>

            {progress !== undefined && (
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end gap-1.5">
                        <button
                            onClick={() => breakdownData && setIsBreakdownOpen(true)}
                            disabled={!breakdownData}
                            className={`flex justify-between w-40 text-[9px] font-black uppercase tracking-[0.15em] hover:opacity-80 transition-opacity ${breakdownData ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            <span className="text-slate-400">Readiness</span>
                            <span className="text-[#1e3a8a]">{progress}%</span>
                        </button>
                        <div
                            onClick={() => breakdownData && setIsBreakdownOpen(true)}
                            className={`h-1.5 w-40 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 ${breakdownData ? 'cursor-pointer hover:ring-2 ring-blue-100 transition-all' : ''}`}
                        >
                            <div
                                className="h-full bg-gradient-to-r from-[#1e3a8a] to-blue-500 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/profile')}
                        className="group relative flex items-center gap-3 active-click px-1 py-1 pr-4 rounded-full bg-slate-50 border border-slate-200/50 hover:bg-white hover:shadow-md transition-all duration-300"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] flex items-center justify-center text-[10px] font-black text-white border-2 border-white shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <span className="text-xs font-bold text-[#0f172a] truncate max-w-[100px]">{userName}</span>
                    </button>
                </div>
            )}
        </header>
    );
};
