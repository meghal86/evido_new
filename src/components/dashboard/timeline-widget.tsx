'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';

interface TimelineWidgetProps {
    counts: { evidence: number; letters: number };
}

export const TimelineWidget: React.FC<TimelineWidgetProps> = ({ counts }) => {
    // Determine current stage
    const getStage = () => {
        if (counts.evidence >= 8 && counts.letters >= 3) return 4; // Ready
        if (counts.evidence >= 5 && counts.letters >= 1) return 3; // Final Review
        if (counts.evidence >= 3) return 2; // Expert Validation
        if (counts.evidence > 0) return 1; // Gathering
        return 0; // Onboarding
    };

    const currentStage = getStage();

    const stages = [
        { id: 0, label: "Onboarding", desc: "Connect accounts" },
        { id: 1, label: "Evidence Gathering", desc: "Upload docs" },
        { id: 2, label: "Expert Validation", desc: "Get letters" },
        { id: 3, label: "Final Review", desc: "Draft synthesis" },
        { id: 4, label: "Ready to File", desc: "Submit petition" }
    ];

    const progress = (currentStage / (stages.length - 1)) * 100;

    return (
        <div className="max-w-5xl mx-auto mb-10 px-4 lg:px-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="glass rounded-[2.5rem] p-8 border border-white/50 shadow-sm relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-wide">Case Timeline</h3>
                            <p className="text-sm text-slate-500 font-medium">Estimated Filing Date: <span className="text-[#1e3a8a] font-bold">Oct 15, 2026</span></p>
                        </div>
                        <div className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-black rounded-xl border border-blue-100 uppercase tracking-widest">
                            Stage {currentStage + 1} of 5
                        </div>
                    </div>

                    <div className="relative">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-100 rounded-full -translate-y-1/2" />

                        {/* Active Progress */}
                        <div
                            className="absolute top-1/2 left-0 h-2 bg-[#1e3a8a] rounded-full -translate-y-1/2 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />

                        {/* Stages */}
                        <div className="relative flex justify-between">
                            {stages.map((stage) => {
                                const isCompleted = currentStage > stage.id;
                                const isCurrent = currentStage === stage.id;

                                return (
                                    <div key={stage.id} className="flex flex-col items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${isCompleted ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white' :
                                                isCurrent ? 'bg-white border-[#1e3a8a] text-[#1e3a8a] shadow-lg scale-110' :
                                                    'bg-white border-slate-200 text-slate-300'
                                            }`}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                                                isCurrent ? <Clock className="w-5 h-5 animate-pulse" /> :
                                                    <Circle className="w-5 h-5" />}
                                        </div>
                                        <div className={`text-center transition-opacity duration-500 ${isCurrent ? 'opacity-100' : 'opacity-60'}`}>
                                            <p className={`text-xs font-black uppercase tracking-wider ${isCurrent ? 'text-[#1e3a8a]' : 'text-slate-500'}`}>
                                                {stage.label}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">{stage.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
