'use client';

import React, { useState } from 'react';
import { CloudUpload, X, FileText, Trash2, Calendar, Link as LinkIcon, ChevronDown, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { saveEvidenceRecord } from '@/app/actions/upload';
import { toast } from 'sonner';

interface UploadEvidenceProps {
    onClose?: () => void;
}

interface UIFile {
    id: string;
    file: File;
    name: string;
    size: string;
    date: string;
    type: string;
    status: 'pending' | 'uploaded' | 'error';
}

export const UploadEvidence: React.FC<UploadEvidenceProps> = ({ onClose }) => {
    const router = useRouter();
    const [files, setFiles] = useState<UIFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        url: '',
        criterion: 'awards',
        date: ''
    });
    const [confirmed, setConfirmed] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substring(7),
                file,
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                date: new Date().toLocaleDateString(),
                type: file.type.includes('pdf') ? 'PDF' : 'IMG',
                status: 'pending' as const
            }));
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);

        try {
            for (const uiFile of files) {
                const fileName = `${Date.now()}-${uiFile.name}`;
                const { data, error } = await supabase.storage
                    .from('evidence')
                    .upload(fileName, uiFile.file);

                if (error) throw error;

                await saveEvidenceRecord({
                    title: uiFile.name,
                    description: formData.description,
                    url: formData.url,
                    filePath: data?.path || '',
                    criterionId: formData.criterion,
                    sourceDate: formData.date ? new Date(formData.date) : undefined,
                    sourceType: 'Manual', // Default for uploads
                    exhibitId: `EXT-${Math.floor(Math.random() * 1000)}` // Temporary auto-gen ID
                });
            }
            toast.success("Evidence uploaded successfully");
            setFiles([]);
            toast.success("Evidence uploaded successfully");
            setFiles([]);
            setFormData({ description: '', url: '', criterion: 'awards', date: '' });
            if (onClose) onClose(); else router.back();
        } catch (error) {
            console.error(error);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = (id: string) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    return (
        <div className="pt-32 lg:pt-28 pb-12 px-4 lg:px-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-[#1e293b]">Upload Evidence</h2>
                        <p className="text-[#64748b] text-sm font-medium">Add documents to support your EB-1A petition.</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 lg:p-8 space-y-6 lg:space-y-8">
                    {/* Privacy Notice */}
                    <div className="bg-[#f0fdf4] border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                        <Lock className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-[12px] font-bold text-emerald-800 uppercase tracking-wide">Privacy Guaranteed</p>
                            <p className="text-[13px] text-[#64748b] leading-relaxed">
                                Your documents are encrypted and never shared with third parties. Read our <a href="#" className="text-[#1e3a8a] font-bold hover:underline">privacy policy →</a>
                            </p>
                        </div>
                    </div>

                    {/* Criterion Selection */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Criterion</label>
                        <div className="relative">
                            <select
                                value={formData.criterion}
                                onChange={(e) => setFormData({ ...formData, criterion: e.target.value })}
                                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-[#1e3a8a] outline-none font-bold text-[#1e293b] text-sm lg:text-base"
                            >
                                <option value="awards">Awards (Criterion 1)</option>
                                <option value="memberships">Memberships (Criterion 2)</option>
                                <option value="published_material">Published Material (Criterion 3)</option>
                                <option value="judging">Judging (Criterion 4)</option>
                                <option value="contributions">Original Contributions (Criterion 5)</option>
                                <option value="authorship">Authorship (Criterion 6)</option>
                                <option value="leading_role">Leading Role (Criterion 7)</option>
                                <option value="salary">High Salary (Criterion 8)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Upload Zone */}
                    <div className="relative border-3 border-dashed border-slate-200 rounded-3xl p-8 lg:p-12 flex flex-col items-center justify-center bg-[#f8fafc] hover:bg-slate-100 hover:border-[#1e3a8a] transition-all cursor-pointer group">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <CloudUpload className="w-8 h-8 text-[#1e3a8a]" />
                        </div>
                        <p className="text-base lg:text-lg font-black text-[#1e293b] mb-1 text-center">Drag & drop your evidence here</p>
                        <p className="text-slate-500 text-sm">or <span className="text-[#1e3a8a] font-black">click to browse</span></p>
                        <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">PDF, JPG, PNG (Max 10MB)</p>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="flex items-center gap-3 ml-1">
                        <input
                            type="checkbox"
                            id="confirm"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                        />
                        <label htmlFor="confirm" className="text-sm font-bold text-[#1e293b] cursor-pointer">
                            I confirm this is my own documentation
                        </label>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                Ready to Upload
                                <span className="bg-[#1e3a8a] text-white px-2 py-0.5 rounded text-[10px] font-black">{files.length}</span>
                            </h3>

                            <AnimatePresence>
                                {files.map((file) => (
                                    <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="p-5 lg:p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#1e3a8a] hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${file.type === 'PDF' ? 'bg-rose-50 text-[#f43f5f]' : 'bg-blue-50 text-blue-500'}`}>
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-[#1e293b] truncate text-sm lg:text-base">{file.name}</h4>
                                                    <button
                                                        onClick={() => deleteFile(file.id)}
                                                        className="text-slate-300 hover:text-[#f43f5f] transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="flex gap-3 text-[11px] text-[#64748b] mt-1 font-bold uppercase tracking-wider">
                                                    <span>{file.size}</span>
                                                    <span>•</span>
                                                    <span>{file.date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Evidence Description</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Evidence of original code impact"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#1e3a8a] outline-none font-medium"
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-grow">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Achievement Date</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            value={formData.date}
                                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#1e3a8a] outline-none font-medium"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Verification URL</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="https://..."
                                                            value={formData.url}
                                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#1e3a8a] outline-none font-medium"
                                                        />
                                                        <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <div className="p-6 lg:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 lg:gap-4">
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 text-[#64748b] font-black hover:text-[#1e293b] transition-colors order-2 sm:order-1"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!confirmed || files.length === 0 || uploading}
                        className="px-8 py-3 bg-[#1e3a8a] text-white font-black rounded-xl shadow-lg hover:bg-[#1e40af] transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                    >
                        {uploading ? 'Uploading...' : 'Save Evidence'}
                    </button>
                </div>
            </div>
        </div>
    );
};
