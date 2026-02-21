'use client';

import React, { useState } from 'react';
import { FileText, Plus, Calendar, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateReport } from '@/app/actions/reports';
import { toast } from 'sonner';

interface ReportListProps {
    reports: any[];
}

export const ReportList: React.FC<ReportListProps> = ({ reports }) => {
    const router = useRouter();
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await generateReport();
            if (result.success) {
                toast.success("New report generated successfully");
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to generate report");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0f172a] tracking-tight mb-2">Evidence Reports</h1>
                    <p className="text-slate-500 font-medium">AI-generated assessments of your EB-1A case strength.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="px-6 py-3 bg-[#1e3a8a] text-white font-black rounded-xl shadow-lg shadow-blue-900/10 hover:premium-shadow hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 active-click uppercase tracking-widest text-xs"
                >
                    {generating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Synthesizing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Generate New Report
                        </>
                    )}
                </button>
            </div>

            {reports.length === 0 ? (
                <div className="glass p-16 rounded-[2.5rem] text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <FileText className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-[#0f172a] mb-2">No Reports Yet</h3>
                    <p className="text-slate-500 font-medium mb-8">Generate your first AI assessment to identify gaps in your case.</p>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="px-8 py-3 bg-white border border-slate-200 text-[#1e3a8a] font-black rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs shadow-sm"
                    >
                        Create First Report
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            onClick={() => router.push(`/reports/${report.id}`)}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:premium-shadow transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[3rem] -mr-4 -mt-4 transition-transform group-hover:scale-105" />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-[#1e3a8a] transition-colors duration-500">
                                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${report.score >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        report.score >= 70 ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            report.score >= 40 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-rose-50 text-rose-700 border-rose-100'
                                    }`}>
                                    Score: {report.score}%
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-[#0f172a] mb-2 line-clamp-1">{report.title}</h3>

                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
                                <Calendar className="w-3 h-3" />
                                {new Date(report.createdAt).toLocaleDateString()}
                            </div>

                            <div className="flex items-center text-[#1e3a8a] text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                View Analysis <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
