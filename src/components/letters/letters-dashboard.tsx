'use client';

import React, { useState } from 'react';
import { LetterCard, LetterProps } from './letter-card';
import { AddExpertModal } from './add-expert-modal';
import { Plus, Users, ArrowLeft } from 'lucide-react';
import { requestLetter, updateLetterStatus } from '@/app/actions/letters';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { EmailPreviewModal } from './email-preview-modal';

export const LettersDashboard = ({ letters }: { letters: any[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState<{ id: string, name: string, email: string } | null>(null);
    const router = useRouter();

    const handleRequest = (id: string, name: string, email: string) => {
        setSelectedExpert({ id, name, email });
        setPreviewModalOpen(true);
    };

    const handleSendEmail = async () => {
        if (!selectedExpert) return;

        const result = await requestLetter(selectedExpert.id);
        if (result.error) toast.error(result.error);
        else toast.success("Letter requested successfully!");

        setPreviewModalOpen(false);
        setSelectedExpert(null);
    };

    const handleRemind = async (id: string) => {
        toast.success("Reminder sent!");
    };

    return (
        <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
            >
                <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span>Back</span>
            </button>

            <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-2">Recommendation Letters</h2>
                    <p className="text-slate-500 font-medium">Manage your expert testimonials. You need 5-7 strong letters.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-[#1e3a8a] text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-900/10 hover:premium-shadow hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Expert
                </button>
            </div>

            {/* Pipeline View */}
            <div className="space-y-12">
                {['not_requested', 'requested', 'draft_received', 'final_received', 'signed'].map(statusGroup => {
                    const groupLetters = letters.filter((l: any) => l.status === statusGroup);
                    if (groupLetters.length === 0 && statusGroup !== 'not_requested') return null;

                    return (
                        <div key={statusGroup} className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${statusGroup === 'signed' ? 'bg-emerald-500' :
                                        statusGroup === 'final_received' ? 'bg-blue-500' :
                                            statusGroup === 'draft_received' ? 'bg-purple-500' :
                                                statusGroup === 'requested' ? 'bg-amber-500' : 'bg-slate-300'
                                    }`} />
                                {statusGroup.replace('_', ' ')}
                                <span className="text-slate-200">({groupLetters.length})</span>
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                {groupLetters.length === 0 ? (
                                    <p className="text-sm text-slate-300 italic pl-4">No experts in this stage.</p>
                                ) : (
                                    groupLetters.map((letter: any) => (
                                        <LetterCard
                                            key={letter.id}
                                            {...letter}
                                            onRequest={() => handleRequest(letter.id, letter.expertName, letter.expertEmail)}
                                            onRemind={() => handleRemind(letter.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AddExpertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {selectedExpert && (
                <EmailPreviewModal
                    isOpen={previewModalOpen}
                    onClose={() => setPreviewModalOpen(false)}
                    expertName={selectedExpert.name}
                    expertEmail={selectedExpert.email}
                    onSend={handleSendEmail}
                />
            )}
        </div>
    );
};
