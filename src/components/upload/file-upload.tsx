'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { extractTextFromFile } from '@/lib/ocr';
import { analyzeDocumentText } from '@/app/actions/ai';
import { createEvidenceItem } from '@/app/actions/evidence';
import { useRouter } from 'next/navigation';

export const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0];
        if (!uploadedFile) return;

        setFile(uploadedFile);
        setIsProcessing(true);
        setProgress(10); // Start processing

        try {
            // Step 1: OCR
            setProgress(30);
            toast.info("Extracting text from document...");
            const text = await extractTextFromFile(uploadedFile);

            // Step 2: AI Analysis
            setProgress(60);
            toast.info("Analyzing content with AI...");
            const analysis = await analyzeDocumentText(text);

            setAnalysisResult(analysis);
            setShowModal(true);
            setProgress(100);
            setIsProcessing(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to process document");
            setIsProcessing(false);
            setFile(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1
    });

    const handleConfirm = async () => {
        if (!analysisResult) return;

        try {
            const result = await createEvidenceItem({
                title: analysisResult.title,
                description: analysisResult.description,
                criterionId: analysisResult.criterionId,
                sourceType: 'Manual Upload (OCR)',
                sourceDate: analysisResult.sourceDate,
                metrics: analysisResult.metrics,
                extractedText: analysisResult.extractedText,
                aiAnalysis: analysisResult
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Evidence added successfully!");
                router.push(`/criteria/${analysisResult.criterionId}`);
            }
        } catch (error) {
            toast.error("Failed to save evidence");
        } finally {
            setShowModal(false);
            setFile(null);
            setAnalysisResult(null);
        }
    };

    const handleManualEdit = () => {
        // Logic for switching to manual form (simplified for now)
        toast.info("Switching to manual edit mode (Coming Soon)");
        setShowModal(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!file && (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${isDragActive
                            ? 'border-[#1e3a8a] bg-blue-50/50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">Upload Evidence</h3>
                    <p className="text-slate-500 text-sm mb-6">Drag & drop your PDF or Image here, or click to browse.</p>
                    <div className="flex justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>PDF</span>
                        <span>•</span>
                        <span>JPG</span>
                        <span>•</span>
                        <span>PNG</span>
                    </div>
                </div>
            )}

            {file && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-bold text-slate-800 text-sm">{file.name}</h4>
                            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        {!isProcessing && (
                            <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>

                    {isProcessing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-[#1e3a8a] uppercase tracking-widest">
                                <span>Processing Document...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#1e3a8a] transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 text-center mt-2">
                                {progress < 40 ? "Extracting text..." : "Analyzing with AI..."}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* AI Analysis Result Modal */}
            {showModal && analysisResult && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-800">Analysis Complete</h3>
                                <p className="text-sm text-slate-500">Review the extracted details below.</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Suggested Criterion</p>
                                <p className="text-[#1e3a8a] font-bold text-lg capitalize">{analysisResult.criterionId}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Confidence</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${analysisResult.metrics.confidence_score > 0.7 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className="text-slate-700 font-bold">{(analysisResult.metrics.confidence_score * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Date Detected</p>
                                    <p className="text-slate-700 font-bold">
                                        {analysisResult.sourceDate ? new Date(analysisResult.sourceDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Description</p>
                                <p className="text-slate-600 text-sm leading-relaxed">{analysisResult.description}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleManualEdit}
                                className="flex-1 py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                Edit Details
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-900 transition-colors"
                            >
                                Confirm & Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
