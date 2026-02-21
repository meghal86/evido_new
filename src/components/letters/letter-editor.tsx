'use client';

import React, { useState } from 'react';
import { Loader2, Wand2, Save, ArrowLeft, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { generateLetterDraft, updateLetterContent } from '@/app/actions/letters';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const LetterEditor = ({ letter }: { letter: any }) => {
    const router = useRouter();
    const [content, setContent] = useState(letter.aiFeedback?.draft || '');
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await generateLetterDraft(letter.id);
            if (result.success) {
                setContent(result.content);
                toast.success("Draft Generated Successfully");
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to generate draft");
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateLetterContent(letter.id, content);
            if (result.success) {
                toast.success("Draft Saved");
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to save draft");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">

            <button
                onClick={() => router.push('/letters')}
                className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group print:hidden"
            >
                <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span>Back to Letters</span>
            </button>

            <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                {/* Editor Area */}
                <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 lg:p-12 print:shadow-none print:border-none print:p-0">
                    {!content && !generating ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <Wand2 className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0f172a] mb-2">Generate Expert Draft</h3>
                            <p className="text-slate-500 max-w-md mb-8">
                                Use our AI Engine to draft a personalized recommendation letter based on your evidence and the recommender's profile.
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="px-8 py-4 bg-[#1e3a8a] text-white font-black rounded-2xl shadow-xl hover:premium-shadow transition-all flex items-center gap-3"
                            >
                                <Wand2 className="w-5 h-5" />
                                Generate Initial Draft
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {generating ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-pulse">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synthesizing Letter...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4 print:hidden">
                                        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            Editable Draft
                                        </div>
                                        <button
                                            onClick={() => window.print()}
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Printer className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full h-[800px] resize-none font-serif text-lg leading-loose text-slate-800 focus:outline-none placeholder:text-slate-300 print:hidden"
                                        placeholder="Letter content..."
                                    />
                                    {/* Print View */}
                                    <div className="hidden print:block font-serif text-12pt leading-relaxed text-black whitespace-pre-wrap">
                                        {content}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6 print:hidden">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg sticky top-32">
                        <h4 className="font-black text-[#0f172a] mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Actions
                        </h4>

                        <button
                            onClick={handleSave}
                            disabled={saving || !content}
                            className="w-full py-3 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg hover:bg-blue-900 transition-all flex justify-center items-center gap-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>

                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all flex justify-center items-center gap-2 text-sm"
                        >
                            <Wand2 className="w-4 h-4" />
                            Regenerate Draft
                        </button>

                        <hr className="my-6 border-slate-100" />

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommender</label>
                                <p className="font-bold text-slate-800 text-sm">{letter.expertName}</p>
                                <p className="text-xs text-slate-500">{letter.expertTitle}, {letter.expertOrg}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${letter.status === 'signed' ? 'bg-emerald-500' :
                                            letter.status === 'draft_received' ? 'bg-purple-500' : 'bg-slate-300'
                                        }`} />
                                    <p className="text-xs font-bold text-slate-600 capitalize">{letter.status?.replace('_', ' ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
