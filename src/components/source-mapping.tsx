'use client';

import React from 'react';
import { GitCommit, ArrowRight, FileCode, Database, Trophy, Zap } from 'lucide-react';

interface Repo {
    name: string;
    description: string;
    stars: number;
    language: string;
    topics: string[];
}

interface SourceMappingProps {
    repos: Repo[];
}

export const SourceMapping: React.FC<SourceMappingProps> = ({ repos = [] }) => {
    // Mock mapping logic (in reality this would come from AI analysis)
    const getCriteriaForRepo = (repo: Repo) => {
        const criteria = [];
        const topics = repo.topics || [];
        if (repo.stars > 100) criteria.push('Original Contributions');
        if (topics.includes('award') || topics.includes('hackathon')) criteria.push('Awards');
        if (repo.language === 'TypeScript' || repo.language === 'Python') criteria.push('Authorship');
        if (criteria.length === 0) criteria.push('Leading Role'); // Fallback
        return criteria;
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <GitCommit className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#0f172a]">Impact Traceability</h3>
                        <p className="text-sm text-slate-500 font-medium">Visualizing how your code translates to legal evidence.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5" />
                    AI Graphic
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-slate-200 via-indigo-200 to-slate-200 transform -translate-x-1/2" />

                <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Database className="w-4 h-4" /> Source Repositories
                    </h4>
                    {repos.slice(0, 3).map((repo, idx) => (
                        <div key={idx} className="group relative p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-slate-700 flex items-center gap-2">
                                    <FileCode className="w-4 h-4 text-slate-400" />
                                    {repo.name}
                                </div>
                                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded border border-slate-100 text-slate-500">{repo.language}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{repo.description || "No description provided."}</p>

                            {/* Visual Connector Dot */}
                            <div className="hidden lg:block absolute -right-[25px] top-1/2 w-3 h-3 rounded-full bg-slate-200 border-2 border-white group-hover:bg-indigo-500 transition-colors z-10" />
                        </div>
                    ))}
                    {repos.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm font-medium italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            No repositories connected yet.
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Trophy className="w-4 h-4" /> Mapped Evidence
                    </h4>
                    {repos.slice(0, 3).map((repo, idx) => {
                        const strategies = getCriteriaForRepo(repo);
                        return (
                            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm relative h-[106px] flex flex-col justify-center">
                                {/* Visual Connector Dot */}
                                <div className="hidden lg:block absolute -left-[25px] top-1/2 w-3 h-3 rounded-full bg-slate-200 border-2 border-white z-10" />

                                <div className="space-y-2">
                                    {strategies.map(s => (
                                        <div key={s} className="flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                                            <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                                            {s}
                                        </div>
                                    ))}
                                    <div className="text-xs text-slate-500 pl-5.5">
                                        Generated via {repo.stars > 0 ? `${repo.stars} stars` : 'code analysis'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {repos.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm font-medium italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            Connect GitHub to see impact trace.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
