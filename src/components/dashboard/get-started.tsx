'use client';

import { CheckCircle2, ChevronRight, Github, FileText, Award, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface Step {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    isCompleted: boolean;
}

export function GetStarted({ githubConnected, evidenceCount }: { githubConnected: boolean, evidenceCount: number }) {
    const steps: Step[] = [
        {
            id: 'github',
            title: 'Connect GitHub',
            description: 'Link your open-source contributions to jumpstart your profile.',
            icon: Github,
            href: '/connect/github',
            isCompleted: githubConnected
        },
        {
            id: 'awards',
            title: 'Add First Award',
            description: 'Log an industry or company award to establish recognition.',
            icon: Award,
            href: '/criteria/awards',
            isCompleted: evidenceCount > 0
        },
        {
            id: 'resume',
            title: 'Upload Resume',
            description: 'Provide your full background for comprehensive AI analysis.',
            icon: FileText,
            href: '/upload',
            isCompleted: evidenceCount > 3 // rough proxy for having uploaded more items
        }
    ];

    const completedCount = steps.filter(s => s.isCompleted).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    return (
        <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-sm relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black text-[#1e293b] mb-1">Get Started Checklist</h2>
                        <p className="text-sm font-medium text-slate-500">Complete these steps to build your baseline case.</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-[#1e3a8a]">{progress}% Complete</span>
                        <div className="w-32 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {steps.map((step) => (
                        <Link
                            key={step.id}
                            href={step.href}
                            className={`p-4 rounded-2xl border transition-all duration-300 group flex flex-col h-full bg-white relative overflow-hidden
                                ${step.isCompleted
                                    ? 'border-emerald-200 shadow-sm opacity-80 hover:opacity-100'
                                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-1'
                                }`}
                        >
                            {step.isCompleted && (
                                <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                    Done
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-3 mt-1">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                    ${step.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform'}
                                `}>
                                    {step.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                </div>
                                <h3 className={`font-bold ${step.isCompleted ? 'text-slate-500' : 'text-slate-900 group-hover:text-[#1e3a8a] transition-colors'}`}>
                                    {step.title}
                                </h3>
                            </div>

                            <p className="text-xs text-slate-500 font-medium leading-relaxed flex-grow">
                                {step.description}
                            </p>

                            {!step.isCompleted && (
                                <div className="mt-4 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                    Continue <ChevronRight className="w-3 h-3" />
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
