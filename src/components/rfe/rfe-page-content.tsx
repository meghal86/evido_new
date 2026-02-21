'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Upload, FileText, AlertTriangle, CheckCircle2, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { analyzeRFE, generateRFEResponse } from '@/app/actions/rfe';
import { toast } from 'sonner';
import { extractTextFromFile } from '@/lib/ocr';
import { DataHandlingModal } from '@/components/rfe/data-handling-modal';

interface RFEClientPageProps {
    initialProgress: number;
}

export function RFEClientPage({ initialProgress }: RFEClientPageProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [response, setResponse] = useState<string | null>(null);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    // ... (rest of methods)

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);

        try {
            // 1. Extract Text (Client-Side)
            toast.info("Extracting text from PDF...");
            const text = await extractTextFromFile(file);

            // 2. Send to Server for AI Analysis
            toast.info("Analyzing with Gemini AI...");
            const result = await analyzeRFE(text, file.name);

            if (result.error) {
                toast.error(result.error);
                setIsAnalyzing(false);
                return;
            }

            setAnalysis(result.analysis);
            setIsAnalyzing(false);
            toast.success("RFE Analysis Complete");
        } catch (error) {
            console.error(error);
            toast.error("Failed to process document");
            setIsAnalyzing(false);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        const result = await generateRFEResponse(analysis.issues.map((i: any) => i.id));
        setResponse(result.responseDraft);
        setIsGenerating(false);
        toast.success("Response Draft Generated");
    };

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="RFE Response Generator" progress={initialProgress} />

            <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">

                {!analysis ? (
                    <div className="max-w-xl mx-auto text-center space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Received an RFE?</h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-6">
                                Don't panic. Upload the Request for Evidence PDF provided by USCIS.
                                Our AI will analyze the officer's concerns and draft a winning response strategy.
                            </p>

                            {/* Static Info Alert (P2-3) */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3 text-left">
                                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-blue-800">Bank-Level Security</p>
                                    <p className="text-[11px] text-blue-600 leading-snug">
                                        Documents are processed in an <strong>Attorney Eyes Only</strong> environment using AES-256 encryption.
                                        Files are automatically purged after 30 days unless archived.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge Trigger */}
                        <div
                            onClick={() => setIsSecurityModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full cursor-pointer hover:bg-emerald-100 transition-colors group"
                        >
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">HIPAA & AES-256 Secured</span>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 hover:bg-slate-50 transition-all relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Upload className="w-8 h-8" />
                            </div>
                            {file ? (
                                <div>
                                    <p className="font-bold text-slate-800">{file.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">Ready to analyze</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 mb-2">Upload RFE PDF</h3>
                                    <p className="text-slate-500 text-sm">Max file size 10MB</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!file || isAnalyzing}
                            className="w-full py-4 bg-[#1e3a8a] text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 hover:premium-shadow hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Document...
                                </>
                            ) : (
                                <>
                                    Analyze RFE
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Analysis Column */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-black text-[#0f172a]">Officer's Concerns</h3>
                                </div>
                                <p className="text-slate-600 text-sm mb-6">{analysis.summary}</p>

                                <div className="bg-slate-50 p-4 rounded-xl mb-6">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">My Analysis of Tone</h4>
                                    <p className="text-slate-700 font-bold text-sm">{analysis.tone_analysis}</p>
                                </div>

                                <div className="space-y-4">
                                    {analysis.challenged_criteria?.map((item: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800 text-sm capitalize">{item.criterion_id.replace('_', ' ')}</h4>
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-red-100 text-red-700">
                                                    Challenged
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-3">"{item.officer_reasoning}"</p>

                                            <div className="pl-3 border-l-2 border-emerald-200">
                                                <p className="text-xs font-bold text-emerald-700 mb-1">Suggested Rebuttal:</p>
                                                <p className="text-xs text-slate-600 mb-2">{item.suggested_response}</p>

                                                <p className="text-xs font-bold text-emerald-700 mb-1">Evidence Needed:</p>
                                                <ul className="list-disc list-inside text-xs text-slate-600">
                                                    {item.evidence_needed?.map((ev: string, i: number) => (
                                                        <li key={i}>{ev}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {analysis.positive_findings?.length > 0 && (
                                    <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Positive Findings (Not Challenged)</h4>
                                        <ul className="list-disc list-inside text-xs text-emerald-800 font-medium">
                                            {analysis.positive_findings.map((finding: string, i: number) => (
                                                <li key={i}>{finding}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Response Column */}
                        <div className="space-y-6">
                            {response ? (
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg h-full">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-black text-[#0f172a]">Draft Response</h3>
                                        <button className="text-xs font-bold text-[#1e3a8a] hover:underline">Download Word Doc</button>
                                    </div>
                                    <div className="prose prose-sm prose-slate max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-sm">
                                            {response}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                                    <FileText className="w-12 h-12 mb-4 opacity-50" />
                                    <p className="font-medium">Response draft will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <DataHandlingModal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} />
        </div>
    );
}
