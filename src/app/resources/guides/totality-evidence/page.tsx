
import { Header } from '@/components/header';
import { ArrowLeft, Scale, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TotalityGuide() {
    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="Guide: Final Merits" />
            <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">

                <Link href="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1e3a8a] transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Library
                </Link>

                <h1 className="text-3xl font-black text-[#0f172a] mb-6">The "Totality of Evidence" Standard</h1>
                <p className="text-xl text-slate-500 font-medium mb-12">Mastering the Kazarian Analysis and the Final Merits Determination.</p>

                <div className="grid grid-cols-1 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2">What is Final Merits?</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    After determining you meet at least 3 criteria, the officer asks: "Does this evidence, efficiently viewed, demonstrate that the applicant is at the very top of their field?" This is subjective and where most cases fail.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2">Sustained Acclaim</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    You must prove your success isn't a "one-hit wonder". Show a pattern of achievement over time. Updates, continued judging invitations, and new citations are crucial here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-[2rem] text-white">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        Winning Strategy
                    </h3>
                    <p className="text-blue-100/90 leading-relaxed max-w-2xl">
                        Focus your recommendation letters and personal statement on the <strong>impact</strong> of your work, not just the existence of it. Why does it matter to the US? Who relies on it? Connect the dots for the officer.
                    </p>
                </div>

            </div>
        </div>
    );
}
