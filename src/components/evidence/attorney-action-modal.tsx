'use client';

import React, { useState } from 'react';
import { X, AlertCircle, AlertTriangle } from 'lucide-react';

interface AttorneyActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (notes: string) => void;
    actionType: 'reject' | 'revision';
    evidenceTitle: string;
}

export const AttorneyActionModal: React.FC<AttorneyActionModalProps> = ({ isOpen, onClose, onSubmit, actionType, evidenceTitle }) => {
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const isReject = actionType === 'reject';
    const title = isReject ? 'Reject Evidence' : 'Request Revision';
    const description = isReject
        ? 'Please provide a reason for rejecting this evidence. This will be visible to the client.'
        : 'Please provide instructions for what needs to be revised. Be specific.';
    const buttonText = isReject ? 'Reject Evidence' : 'Send Request';
    const buttonColor = isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700';
    const icon = isReject ? <AlertCircle className="w-6 h-6 text-red-600" /> : <AlertTriangle className="w-6 h-6 text-amber-600" />;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(notes);
        setNotes('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isReject ? 'bg-red-50' : 'bg-amber-50'}`}>
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#0f172a]">{title}</h2>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{evidenceTitle}</p>
                    </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {description}
                </p>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        required
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all text-sm resize-none mb-4"
                        placeholder="Enter your notes here..."
                    />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 py-2.5 text-white font-bold text-sm rounded-xl transition-all shadow-lg ${buttonColor}`}
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
