'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Clock, X } from 'lucide-react';

interface DataHandlingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DataHandlingModal: React.FC<DataHandlingModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-lg">Data Recovery Policy</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Security Level: Bank Grade</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">End-to-End Encryption</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Your RFE documents are encrypted using <span className="font-bold text-slate-800">AES-256</span> at rest and TLS 1.3 in transit. We use isolated containers for processing to ensure no data leakage.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <EyeOff className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">Attorney Eyes Only Mode</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Our AI models are running in <span className="font-bold text-slate-800">Zero-Retention Mode</span>. Your documents are NOT used to train our public models. Only your assigned attorney (if any) can view the raw files.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">30-Day Retention Policy</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                To minimize risk, all analyzed RFE documents are automatically scheduled for permanent deletion <span className="font-bold text-slate-800">30 days</span> after the analysis is complete, unless you actively choose to archive them.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-[#1e3a8a] text-white font-black text-sm rounded-xl hover:bg-[#1e40af] transition-colors shadow-lg shadow-blue-900/10"
                    >
                        I Understand & Accept
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-4 font-medium">
                        For more details, please review our full <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};
