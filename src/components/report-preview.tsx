'use client';

import React, { useState } from 'react';
import { Lock, Check, ChevronRight, Share2, Printer, FolderOpen, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateReport } from '@/app/actions/reports';
import { toast } from 'sonner';

interface ReportPreviewProps {
    onUpgrade?: (plan: string) => void;
    initialReport?: any;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ onUpgrade, initialReport }) => {
    const router = useRouter();
    const [report, setReport] = useState(initialReport);
    const [generating, setGenerating] = useState(false);

    const handleUpgrade = (plan: string) => {
        if (onUpgrade) {
            onUpgrade(plan);
        } else {
            router.push('/upgrade');
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await generateReport();
            if (result.success) {
                setReport(result.report);
                toast.success("AI Synthesis Complete");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to generate report");
        } finally {
            setGenerating(false);
        }
    };

    if (!report) {
        return (
            <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="glass p-12 rounded-[3rem] max-w-lg w-full text-center relative overflow-hidden group hover:premium-shadow transition-all duration-700">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                    <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100/50">
                        <Loader2 className={`w-10 h-10 text-[#1e3a8a] ${generating ? 'animate-spin' : 'opacity-20'}`} />
                    </div>

                    <h2 className="text-3xl font-black text-[#0f172a] mb-4 tracking-tight">Generate Evidence Report</h2>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed">Our AI Engine will now synthesize all 10 criteria and your connected sources into a formal legal assessment.</p>

                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="w-full py-4 bg-[#1e3a8a] text-white font-black rounded-2xl shadow-xl shadow-blue-900/10 hover:premium-shadow hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 active-click uppercase tracking-widest text-sm"
                    >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        {generating ? "Synthesizing Nexus..." : "Initiate AI Synthesis"}
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 print:pt-0 print:p-0 print:max-w-none">
            <button
                onClick={() => router.push('/reports')}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-[#1e3a8a] transition-colors group print:hidden"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Back to Reports</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Document View */}
                <div className="flex-grow bg-slate-50 p-4 lg:p-12 rounded-[3rem] min-h-[800px] flex justify-center overflow-hidden border border-slate-200/50 shadow-inner print:bg-white print:p-0 print:border-none print:shadow-none print:items-start">
                    <div className="bg-white w-full max-w-[850px] shadow-2xl relative min-h-[1100px] flex flex-col p-12 lg:p-20 font-serif text-[#0f172a] border border-slate-100 print:shadow-none print:border-none print:max-w-none print:w-full print:p-8">

                        {/* Watermark */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden select-none">
                            <div className="rotate-[-45deg] text-[60px] lg:text-[140px] font-black whitespace-nowrap tracking-tighter uppercase">
                                EVIDO ANALYSIS • EVIDO ANALYSIS
                            </div>
                        </div>

                        {/* Header */}
                        <div className="border-b-4 border-[#0f172a] pb-10 mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end font-sans gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-xl bg-[#1e3a8a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <FolderOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-2xl font-black text-[#0f172a] tracking-tighter">Evido Nexus</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight leading-none">{report.title}</h1>
                                <div className="flex items-center gap-4">
                                    <div className="px-3 py-1 bg-blue-50 text-[#1e3a8a] text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-widest">
                                        Confidential
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Profile Strength: <span className="text-[#10b981]">{report.score}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-loose">
                                Revision: {new Date(report.createdAt).toLocaleDateString()}<br />
                                Status: Draft Assessment
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-slate max-w-none whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700">
                            {(() => {
                                try {
                                    // Try to parse content as JSON
                                    const data = JSON.parse(report.content);

                                    // Check if it has the new structure
                                    const analysis = data.analysis || (typeof data === 'string' ? data : report.content);
                                    const breakdown = data.breakdown || [];

                                    return (
                                        <>
                                            {breakdown.length > 0 && (
                                                <div className="mb-12 not-prose">
                                                    <h3 className="text-xl font-bold text-[#0f172a] mb-6">Criteria Breakdown</h3>
                                                    <div className="grid gap-3">
                                                        {breakdown.map((item: any) => (
                                                            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-2 h-8 rounded-full ${item.status === 'Strong' ? 'bg-emerald-500' :
                                                                            item.status === 'Good' ? 'bg-blue-500' :
                                                                                item.status === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'
                                                                        }`} />
                                                                    <div>
                                                                        <div className="font-bold text-slate-800 capitalize">{item.id}</div>
                                                                        <div className="text-xs text-slate-500 uppercase tracking-widest">{item.status} ({item.points} pts)</div>
                                                                    </div>
                                                                </div>
                                                                {item.status === 'Strong' && <Check className="w-5 h-5 text-emerald-500" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <hr className="my-8 border-slate-200" />
                                                </div>
                                            )}
                                            {typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2)}
                                        </>
                                    );
                                } catch (e) {
                                    // Fallback for old plain text reports
                                    return report.content;
                                }
                            })()}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-12 text-center text-slate-300 text-[10px] font-sans font-black uppercase tracking-[0.3em] border-t border-slate-100">
                            End of Document — Legal Validity Requires Professional Review
                        </div>
                    </div>
                </div>

                {/* Premium CTA Sidebar */}
                <div className="lg:w-[400px] flex-shrink-0 print:hidden">
                    <div className="glass p-10 rounded-[3rem] sticky top-28 space-y-10 hover:premium-shadow transition-all duration-700 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl -mr-10 -mt-10" />

                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shadow-inner">
                                <Lock className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-3xl font-black text-[#0f172a] tracking-tight leading-tight">Unlock Analysis</h3>
                            <p className="text-slate-500 font-medium">Get the complete EB-1A Evidence Roadmap with attorney-vetted strategies.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="p-8 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/60">Executive Plan</span>
                                    <span className="text-3xl font-black">$99</span>
                                </div>

                                <ul className="space-y-4 mb-10 relative z-10">
                                    {['Full PDF Compilation', 'Attorney-Grade AI Drafts', 'Priority Nexus Access'].map((feat) => (
                                        <li key={feat} className="flex items-center gap-3 text-xs font-bold text-blue-100/80">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                                <Check className="w-3 h-3 text-emerald-400" />
                                            </div>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleUpgrade('Basic')}
                                    className="w-full py-4 bg-white text-[#1e3a8a] font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group/btn relative z-10 uppercase tracking-widest text-xs active-click"
                                >
                                    Upgrade Package <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-4 print:hidden">
                                <button
                                    onClick={() => window.print()}
                                    className="p-3 glass rounded-xl text-slate-400 hover:text-[#1e3a8a] transition-all active-click hover:bg-blue-50"
                                    title="Print / Save as PDF"
                                >
                                    <Printer className="w-5 h-5" />
                                </button>
                                <button className="p-3 glass rounded-xl text-slate-400 hover:text-[#1e3a8a] transition-all active-click hover:bg-blue-50">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
