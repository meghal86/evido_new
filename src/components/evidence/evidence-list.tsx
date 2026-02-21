'use client';

import React from 'react';
import { EvidenceCard, EvidenceItemProps } from './evidence-card';
import { Plus, AlertCircle } from 'lucide-react';

interface EvidenceListProps {
    items: EvidenceItemProps[];
    onAddEvidence: () => void;
    isAttorney?: boolean;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onRequestRevision?: (id: string) => void;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({ items, onAddEvidence, isAttorney, onApprove, onReject, onRequestRevision }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Validated Evidence</h3>
                <div className="flex-grow h-px bg-slate-200/50" />
            </div>

            <div className="space-y-4">
                {items.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                        <p className="text-slate-500 font-medium text-sm">No evidence added yet.</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <EvidenceCard
                            key={item.id}
                            {...item}
                            isAttorney={isAttorney}
                            onApprove={() => onApprove?.(item.id)}
                            onReject={() => onReject?.(item.id)}
                            onRequestRevision={() => onRequestRevision?.(item.id)}
                        />
                    ))
                )}

                {/* What's Missing Section */}
                {items.length < 3 && (
                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-3xl flex gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h4 className="font-black text-amber-900 text-sm">What's Missing?</h4>
                            <div className="text-xs text-amber-700/80 mt-1 font-medium leading-relaxed">
                                To strengthen this criterion, consider adding:
                                <ul className="list-disc ml-4 mt-1 space-y-0.5">
                                    <li>Primary evidence of awards</li>
                                    <li>Media coverage of your work</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onAddEvidence}
                    className="w-full py-8 glass border-2 border-dashed border-slate-200/50 rounded-[2rem] text-slate-400 font-black hover:border-[#1e3a8a] hover:text-[#1e3a8a] hover:bg-white transition-all duration-500 flex flex-col items-center justify-center gap-3 group active-click"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-xs uppercase tracking-widest">Connect Additional Evidence</span>
                </button>
            </div>
        </div>
    );
};
