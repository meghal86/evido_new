'use client';

import { Header } from '@/components/header';
import { FileText, Download, Lock, CheckCircle, BookOpen, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ResourcesPage() {
    const router = useRouter();

    const handleDownload = () => {
        // Mock download for now
        toast.success("Downloading Index of Exhibits template...");
        setTimeout(() => {
            const element = document.createElement("a");
            const file = new Blob(["# Index of Exhibits\n\n1. Exhibit 1: ...\n2. Exhibit 2: ..."], { type: 'text/markdown' });
            element.href = URL.createObjectURL(file);
            element.download = "index_of_exhibits_template.md";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        }, 1000);
    };

    const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setChecklistState(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleUpgrade = () => {
        router.push('/settings');
        toast("Upgrade to Pro to access this template", { icon: "🔒" });
    };

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="Agency Resources" />

            <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="mb-12">
                    <h1 className="text-3xl font-black text-[#0f172a] tracking-tight mb-2">Resource Library</h1>
                    <p className="text-slate-500 font-medium mb-8">Expert guides, templates, and successful case studies for your EB-1A journey.</p>

                    {/* Legal Disclaimer (P1-2) */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
                        <p className="text-sm text-amber-900">
                            ⚠️ <strong>Legal Disclaimer:</strong> Evido is not a law firm.
                            This information is not legal advice. Consult a licensed immigration
                            attorney for guidance on your specific case.
                        </p>
                    </div>
                </div>

                {/* Section 1: Educational Guides */}
                <div className="mb-16">
                    <h2 className="text-xl font-black text-[#0f172a] mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#1e3a8a]" />
                        Deep Dive Guides
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/resources/guides/criteria-breakdown" className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:premium-shadow transition-all group cursor-pointer block">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-50 text-[#1e3a8a] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">Guide</span>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#1e3a8a] transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2 group-hover:text-[#1e3a8a] transition-colors">Understanding the 10 Criteria</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">A comprehensive breakdown of USCIS requirements for each evidence category, with examples of "Sustained Acclaim".</p>
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1e3a8a] w-0 group-hover:w-full transition-all duration-700 ease-out" />
                            </div>
                        </Link>

                        <Link href="/resources/guides/totality-evidence" className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:premium-shadow transition-all group cursor-pointer block">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">Strategy</span>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2 group-hover:text-purple-600 transition-colors">The "Totality of Evidence" Standard</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">How to structure your final merits argument (Kazarian Analysis) to prove you are in the top small percentage.</p>
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600 w-0 group-hover:w-full transition-all duration-700 ease-out" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Section 2: Templates & Downloads */}
                <div className="mb-16">
                    <h2 className="text-xl font-black text-[#0f172a] mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#1e3a8a]" />
                        Templates & Examples
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Free Template */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-lg transition-all relative cursor-pointer" onClick={handleDownload}>
                            <div className="absolute top-6 right-6">
                                <Download className="w-5 h-5 text-slate-300" />
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6" />
                            </div>

                            <h3 className="font-bold text-[#0f172a] mb-1">Index of Exhibits</h3>
                            <p className="text-xs text-slate-500 font-medium mb-4">USCIS-compliant table of contents template.</p>
                            <button className="text-xs font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">Download .MD</button>
                        </div>

                        {/* Premium Template 1 */}
                        <div className="glass p-6 rounded-[2rem] border border-amber-100/50 hover:shadow-lg transition-all relative overflow-hidden group cursor-pointer" onClick={handleUpgrade}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-105" />
                            <div className="absolute top-6 right-6 z-10">
                                <Lock className="w-5 h-5 text-amber-500" />
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20 relative z-10">
                                <Shield className="w-6 h-6" />
                            </div>

                            <h3 className="font-bold text-[#0f172a] mb-1 relative z-10">Expert Letter - Template A</h3>
                            <p className="text-xs text-slate-500 font-medium mb-4 relative z-10">Drafting structure for "Independent Expert".</p>
                            <button className="text-xs font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest relative z-10">Unlock Pro</button>
                        </div>

                        {/* Premium Template 2 */}
                        <div className="glass p-6 rounded-[2rem] border border-amber-100/50 hover:shadow-lg transition-all relative overflow-hidden group cursor-pointer" onClick={handleUpgrade}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-105" />
                            <div className="absolute top-6 right-6 z-10">
                                <Lock className="w-5 h-5 text-amber-500" />
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20 relative z-10">
                                <Shield className="w-6 h-6" />
                            </div>

                            <h3 className="font-bold text-[#0f172a] mb-1 relative z-10">Full Petition Cover Letter</h3>
                            <p className="text-xs text-slate-500 font-medium mb-4 relative z-10">25-page sample legal argument structure.</p>
                            <button className="text-xs font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest relative z-10">Unlock Pro</button>
                        </div>
                    </div>
                </div>

                {/* Section 3: Interactive Readiness Checklists */}
                <div className="mb-12">
                    <h2 className="text-xl font-black text-[#0f172a] mb-6 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#1e3a8a]" />
                        Readiness Checklists
                    </h2>
                    <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold text-[#0f172a]">Pre-Filing Essentials</h3>
                                <ul className="space-y-3">
                                    {[
                                        { id: "passport", label: "Passport validity check (>6 months)" },
                                        { id: "refs", label: "Reference letters signed (wet ink or digital)" },
                                        { id: "trans", label: "Translations certified for foreign docs" },
                                        { id: "i140", label: "I-140 Form completed and signed" }
                                    ].map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer group"
                                            onClick={() => toggleItem(item.id)}
                                        >
                                            <div className={`w-5 h-5 rounded-full border transition-colors flex items-center justify-center flex-shrink-0 mt-0.5 ${checklistState[item.id] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                                                {checklistState[item.id] && <CheckCircle className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={checklistState[item.id] ? 'line-through text-slate-400' : ''}>{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold text-[#0f172a]">Evidence Quality Check</h3>
                                <ul className="space-y-3">
                                    {[
                                        { id: "high", label: "Highlighting added to key text in exhibits" },
                                        { id: "curr", label: "Currency conversions for salary evidence" },
                                        { id: "impact", label: "Impact factors included for publications" },
                                        { id: "gs", label: "Google Scholar profile printout updated" }
                                    ].map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer group"
                                            onClick={() => toggleItem(item.id)}
                                        >
                                            <div className={`w-5 h-5 rounded-full border transition-colors flex items-center justify-center flex-shrink-0 mt-0.5 ${checklistState[item.id] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                                                {checklistState[item.id] && <CheckCircle className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={checklistState[item.id] ? 'line-through text-slate-400' : ''}>{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
