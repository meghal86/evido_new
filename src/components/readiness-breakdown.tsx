'use client';

import React from 'react';
import { X, Trophy, CheckCircle2, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReadinessBreakdownProps {
    isOpen: boolean;
    onClose: () => void;
    score: number;
    evidenceCount: number;
    letterCount: number;
    githubConnected: boolean;
    linkedinConnected: boolean;
    scholarConnected: boolean;
}

export const ReadinessBreakdown: React.FC<ReadinessBreakdownProps> = ({
    isOpen, onClose, score, evidenceCount, letterCount,
    githubConnected, linkedinConnected, scholarConnected
}) => {
    if (!isOpen) return null;

    const criteria = [
        { label: "Account Setup", base: 30, current: 30, status: 'complete' },
        { label: "GitHub Connection", base: 15, current: githubConnected ? 15 : 0, status: githubConnected ? 'complete' : 'pending' },
        { label: "LinkedIn Connection", base: 15, current: linkedinConnected ? 15 : 0, status: linkedinConnected ? 'complete' : 'pending' },
        { label: "Scholar Connection", base: 15, current: scholarConnected ? 15 : 0, status: scholarConnected ? 'complete' : 'pending' },
        { label: "Evidence (3+ Items)", base: 15, current: evidenceCount >= 3 ? 15 : Math.min(evidenceCount * 5, 15), status: evidenceCount >= 3 ? 'complete' : 'partial' },
        { label: "Expert Letters (1+)", base: 10, current: letterCount >= 1 ? 10 : 0, status: letterCount >= 1 ? 'complete' : 'pending' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
            >
                <div className="p-8 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Readiness Score</h2>
                                <p className="text-slate-500 font-medium">How your {score}% is calculated</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        {criteria.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    {item.status === 'complete' ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : item.status === 'partial' ? (
                                        <TrendingUp className="w-5 h-5 text-amber-500" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                                    )}
                                    <span className={`font-bold text-sm ${item.status === 'pending' ? 'text-slate-400' : 'text-slate-700'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-sm text-[#0f172a]">+{item.current}%</span>
                                    <span className="text-xs font-bold text-slate-300">/ {item.base}%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-5 flex gap-4 border border-blue-100">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-blue-900 text-sm">Why 65% matters?</h4>
                            <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                                We recommend a score of at least 65% before filing. This indicates you have sufficient evidence across multiple criteria to withstand USCIS scrutiny.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
