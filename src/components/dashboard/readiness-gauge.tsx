'use client';

import { motion } from 'framer-motion';

export function ReadinessGauge({ score }: { score: number }) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let color = 'text-red-500';
    if (score >= 40) color = 'text-amber-500';
    if (score >= 70) color = 'text-emerald-500';

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        className="text-slate-100 dark:text-slate-800"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="96"
                        cy="96"
                    />
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={color}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="96"
                        cy="96"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{score}%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ready</span>
                </div>
            </div>

            <div className="mt-6 text-center z-10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Case Readiness</h3>
                <p className="text-sm text-slate-500 mt-1">Based on EB-1A criteria strength</p>
            </div>
        </div>
    );
}
