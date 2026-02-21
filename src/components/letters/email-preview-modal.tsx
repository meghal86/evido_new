'use client';

import React from 'react';
import { X, Mail, Send } from 'lucide-react';

interface EmailPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    expertName: string;
    expertEmail: string;
    onSend: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, expertName, expertEmail, onSend }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Request Recommendation Letter</h3>
                            <p className="text-xs text-slate-500 font-medium">Draft to: <span className="text-slate-700">{expertEmail}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Line</label>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm">
                            Request for Recommendation Letter - EB-1A Petition
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Body</label>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm leading-relaxed whitespace-pre-wrap h-64 overflow-y-auto font-serif">
                            Dear {expertName},

                            I hope this email finds you well.

                            I am currently in the process of applying for an EB-1A (Extraordinary Ability) green card, and I am writing to respectfully request a recommendation letter from you attesting to the significance of my contributions to the field of [Field Name].

                            Given your expertise and standing in the community, your perspective on my work, specifically [Project/Paper Name], would be invaluable to my petition. The letter would need to focus on the original and major significance of my contributions.

                            I have attached a draft letter for your review, along with my CV and a summary of my work. Please feel free to edit the draft as you see fit.

                            Thank you very much for your time and consideration.

                            Sincerely,
                            [Your Name]
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSend}
                        className="px-5 py-2.5 bg-[#1e3a8a] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-900 transition-all flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
};
