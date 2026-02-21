'use client';

import React from 'react';
import { Mail, Clock, CheckCircle2, AlertTriangle, FileText, MoreVertical, Send, User } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export interface LetterProps {
    id: string;
    expertName: string;
    expertTitle: string;
    expertOrg: string;
    status: 'not_requested' | 'requested' | 'draft_received' | 'final_received' | 'signed';
    dueDate?: Date | null;
    qualityScore?: number | null;
    onRequest?: () => void;
    onRemind?: () => void;
    onView?: () => void;
    onMarkDraft?: () => void;
    onMarkFinal?: () => void;
    onMarkSigned?: () => void;
}

import { useState } from 'react';
import { updateLetterStatus, updateLetterDueDate } from '@/app/actions/letters';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

// ... (keep props interface)

export const LetterCard: React.FC<LetterProps> = ({
    id,
    expertName,
    expertTitle,
    expertOrg,
    status,
    dueDate,
    qualityScore,
    onRequest,
    onRemind,
    onView,
}) => {
    const [isEditingDate, setIsEditingDate] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        const result = await updateLetterStatus(id, newStatus);
        if (result.success) toast.success("Status updated");
    };

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        const result = await updateLetterDueDate(id, newDate);
        if (result.success) {
            toast.success("Due date set");
            setIsEditingDate(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 hover:shadow-xl transition-all flex flex-col md:flex-row gap-5 group relative">
            <div className="flex items-start gap-4 flex-grow min-w-0">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6" />
                </div>

                <div className="min-w-0 flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-black text-[#1e293b] text-base truncate">{expertName}</h4>
                            <p className="text-xs text-[#64748b] font-medium truncate">{expertTitle} at {expertOrg}</p>
                        </div>

                        {/* Status Selector */}
                        <div className="relative group/status">
                            <button className="flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-colors">
                                {status.replace('_', ' ')} <ChevronDown className="w-3 h-3" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-100 shadow-xl rounded-xl p-1 hidden group-hover/status:block z-10">
                                {['not_requested', 'requested', 'draft_received', 'final_received', 'signed'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 ${status === s ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
                                    >
                                        {s.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                        {/* Due Date Picker */}
                        <div className="flex items-center gap-2">
                            {isEditingDate ? (
                                <input
                                    type="date"
                                    className="text-xs border border-slate-200 rounded px-2 py-1"
                                    onChange={handleDateChange}
                                    onBlur={() => setIsEditingDate(false)}
                                    autoFocus
                                />
                            ) : (
                                <div
                                    onClick={() => setIsEditingDate(true)}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border cursor-pointer hover:bg-slate-50 ${dueDate && differenceInDays(new Date(dueDate), new Date()) < 0
                                        ? 'bg-red-50 text-red-700 border-red-100'
                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}
                                >
                                    <CalendarIcon className="w-3 h-3" />
                                    {dueDate ? format(new Date(dueDate), 'MMM d, yyyy') : 'Set Due Date'}
                                </div>
                            )}
                        </div>

                        {/* Status Badge (visual only, redundancy) */}
                        <div className={`w-2 h-2 rounded-full ${status === 'signed' ? 'bg-emerald-500' :
                            status === 'final_received' ? 'bg-blue-500' :
                                status === 'draft_received' ? 'bg-purple-500' :
                                    status === 'requested' ? 'bg-amber-500' : 'bg-slate-300'
                            }`} />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 md:self-center pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 sm:justify-end">
                {status === 'not_requested' && (
                    <button onClick={onRequest} className="px-4 py-2 bg-[#1e3a8a] text-white text-xs font-bold rounded-xl shadow-lg hover:premium-shadow flex gap-2">
                        <Send className="w-3 h-3" /> Request
                    </button>
                )}

                <a
                    href={`/letters/${id}`}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors flex gap-2"
                >
                    <FileText className="w-3 h-3 text-blue-600" />
                    {status === 'not_requested' ? 'Draft' : 'Edit'}
                </a>
            </div>
        </div>
    );
};
