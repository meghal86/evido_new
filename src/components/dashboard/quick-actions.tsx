'use client';

import { FileText, Upload, UserPlus, Users, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

interface QuickActionProps {
    isPremium: boolean;
}

export function QuickActions({ isPremium }: QuickActionProps) {
    const actions = [
        {
            icon: FileText,
            label: 'Generate Report',
            href: '/reports',
            color: 'bg-blue-50 text-blue-600',
            premium: false // Basic feature
        },
        {
            icon: Upload,
            label: 'Upload Evidence',
            href: '/upload',
            color: 'bg-emerald-50 text-emerald-600',
            premium: false
        },
        {
            icon: UserPlus,
            label: 'Request Letter',
            href: '/letters',
            color: 'bg-purple-50 text-purple-600',
            premium: true
        },
        {
            icon: Users,
            label: 'Invite Attorney',
            href: '/team',
            color: 'bg-amber-50 text-amber-600',
            premium: true
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action) => {
                const isLocked = action.premium && !isPremium;
                return (
                    <Link
                        key={action.label}
                        href={isLocked ? '/upgrade' : action.href}
                        className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:premium-shadow transition-all group relative overflow-hidden ${isLocked ? 'opacity-75' : ''}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color}`}>
                            <action.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{action.label}</h4>
                        <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                            {isLocked ? (
                                <span className="flex items-center gap-1 text-amber-500"><Lock className="w-3 h-3" /> Locked</span>
                            ) : (
                                <span className="flex items-center gap-1">Action <ArrowRight className="w-3 h-3" /></span>
                            )}
                        </div>

                        {isLocked && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Upgrade</div>
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
