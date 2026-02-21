'use client';

import React from 'react';
import { ArrowLeft, RefreshCw, Plus, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EvidenceList } from './evidence/evidence-list';
import { EvidenceItemProps } from './evidence/evidence-card';

import { approveEvidence, rejectEvidence, requestRevision, syncGitHubEvidence } from '@/app/actions/evidence';
import { toast } from 'sonner';
import { AttorneyActionModal } from './evidence/attorney-action-modal';

interface CriterionDetailProps {
    onBack?: () => void;
    onAddEvidence?: () => void;
    criterionId?: string;
    topRepo?: any;
    evidenceItems: EvidenceItemProps[];
    isAttorney?: boolean;
}

export const CriterionDetail: React.FC<CriterionDetailProps> = ({ onBack, onAddEvidence, criterionId, topRepo, evidenceItems, isAttorney }) => {
    const router = useRouter();

    const criteriaInfo: Record<string, { title: string, desc: string, status: string }> = {
        awards: { title: "Awards", desc: "Criterion 1: Documentation of the beneficiary's receipt of lesser nationally or internationally recognized prizes or awards for excellence in the field of endeavor.", status: "Strong Evidence" },
        membership: { title: "Membership", desc: "Criterion 2: Documentation of the beneficiary's membership in associations in the field for which classification is sought, which require outstanding achievements of their members, as judged by recognized national or international experts in their disciplines or fields.", status: "Medium Evidence" },
        published: { title: "Published Material", desc: "Criterion 3: Published material about the beneficiary in professional or major trade publications or other major media, relating to the beneficiary's work in the field.", status: "Good Evidence" },
        judging: { title: "Judging", desc: "Criterion 4: Evidence of the beneficiary's participation, either individually or on a panel, as a judge of the work of others in the same or an allied field.", status: "Weak Evidence" },
        original: { title: "Original Contributions", desc: "Criterion 5: Evidence of the beneficiary's original scientific, scholarly, artistic, athletic, or business-related contributions of major significance in the field.", status: "Strong Evidence" },
        authorship: { title: "Authorship", desc: "Criterion 6: Evidence of the beneficiary's authorship of scholarly articles in the field, in professional or major trade publications or other major media.", status: "Good Evidence" },
        leading: { title: "Leading Role", desc: "Criterion 7: Evidence that the beneficiary has performed in a leading or critical role for organizations or establishments that have a distinguished reputation.", status: "Strong Evidence" },
        salary: { title: "High Salary", desc: "Criterion 8: Evidence that the beneficiary has commanded a high salary or other significantly high remuneration for services, in relation to others in the field.", status: "Strong Evidence" },
        artistic: { title: "Artistic Exhibitions", desc: "Criterion 9: Evidence that the beneficiary's work has been displayed at artistic exhibitions or showcases.", status: "N/A" },
        commercial: { title: "Commercial Success", desc: "Criterion 10: Evidence of commercial successes in the performing arts, as shown by box office receipts or record, cassette, compact disk, or video sales.", status: "Medium Evidence" }
    };

    const info = criteriaInfo[criterionId || 'original'] || criteriaInfo['original'];

    // Local attorney state for toggling
    const [attorneyMode, setAttorneyMode] = React.useState(isAttorney || false);

    // Modal state
    const [actionModal, setActionModal] = React.useState<{ isOpen: boolean, type: 'reject' | 'revision', evidenceId: string, title: string }>({
        isOpen: false,
        type: 'reject',
        evidenceId: '',
        title: ''
    });

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const handleAddEvidence = () => {
        if (onAddEvidence) {
            onAddEvidence();
        } else {
            router.push('/upload');
        }
    };

    const handleApprove = async (id: string) => {
        const result = await approveEvidence(id);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Evidence approved");
        }
    };

    const handleReject = (id: string) => {
        const item = evidenceItems.find(i => i.id === id);
        setActionModal({
            isOpen: true,
            type: 'reject',
            evidenceId: id,
            title: item?.title || 'Unknown Item'
        });
    };

    const handleRequestRevision = (id: string) => {
        const item = evidenceItems.find(i => i.id === id);
        setActionModal({
            isOpen: true,
            type: 'revision',
            evidenceId: id,
            title: item?.title || 'Unknown Item'
        });
    };

    const handleModalSubmit = async (notes: string) => {
        const { type, evidenceId } = actionModal;

        let result;
        if (type === 'reject') {
            result = await rejectEvidence(evidenceId, notes);
        } else {
            result = await requestRevision(evidenceId, notes);
        }

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(type === 'reject' ? "Evidence rejected" : "Revision requested");
            // Optimistic update could go here, but router.refresh() or revalidatePath handles it usually
        }
    };

    const handleSync = async () => {
        toast.info("Syncing with GitHub...");
        const result = await syncGitHubEvidence();
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(`Synced ${result.count} new evidence items from GitHub`);
            router.refresh();
        }
    };

    return (
        <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Testing Toggle for Attorney Mode */}
            <div className="flex justify-end mb-4">
                <label className="flex items-center cursor-pointer gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attorney View</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${attorneyMode ? 'bg-[#1e3a8a]' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${attorneyMode ? 'left-4.5' : 'left-0.5'}`} style={{ left: attorneyMode ? '1.125rem' : '0.125rem' }} />
                    </div>
                    <input type="checkbox" className="hidden" checked={attorneyMode} onChange={e => setAttorneyMode(e.target.checked)} />
                </label>
            </div>

            <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-8 border-b border-slate-200/50">
                <div className="flex items-start gap-6">
                    <button
                        onClick={handleBack}
                        className="w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-white hover:premium-shadow transition-all duration-300 active-click group"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-[#1e3a8a] transition-colors" />
                    </button>
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-4">
                            <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">{info.title}</h2>
                            <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                {info.status}
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">{info.desc}</p>
                    </div>
                </div>
                <button
                    onClick={handleSync}
                    className="w-full sm:w-auto px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <Github className="w-4 h-4" />
                    Sync GitHub
                </button>
                <button
                    onClick={handleAddEvidence}
                    className="w-full sm:w-auto px-6 py-3 bg-[#1e3a8a] text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-900/10 hover:premium-shadow hover:-translate-y-0.5 transition-all duration-300 active-click flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Evidence
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <EvidenceList
                        items={evidenceItems}
                        onAddEvidence={handleAddEvidence}
                        isAttorney={attorneyMode}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onRequestRevision={handleRequestRevision}
                    />
                </div>

                <div className="space-y-8">
                    {/* Premium AI Suggestion Card */}
                    <div className="mesh-gradient p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin-slow" />
                                </div>
                                <h3 className="font-black text-xs text-white uppercase tracking-widest">AI Draft Logic</h3>
                            </div>
                            {topRepo && (
                                <button className="text-[9px] font-black text-amber-200 uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 transition-all">
                                    Refresh
                                </button>
                            )}
                        </div>

                        <div className="bg-[#0f172a]/40 backdrop-blur-md rounded-2xl p-6 text-sm text-blue-100/90 leading-relaxed mb-8 border border-white/5 shadow-inner">
                            <span className="text-amber-400 font-black text-2xl leading-none mr-2">"</span>
                            {topRepo ? (
                                <>
                                    The evidence demonstrates major significance through widespread adoption of <span className="text-white font-bold">{topRepo.name}</span>, which has garnered <span className="text-white font-bold">{topRepo.stars} stars</span> and active contributions. This aligns with the 'Major Significance' requirement for Criterion 5.
                                </>
                            ) : (
                                <span className="italic opacity-80">
                                    Connect your GitHub account or upload evidence to generate a real-time impact analysis for this criterion.
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${topRepo ? 'bg-amber-400' : 'bg-slate-500'}`} />
                            <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest">
                                {topRepo ? 'Optimized for EB-1A Cover Letter' : 'Waiting for Data Source'}
                            </p>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shadow-sm">
                                <Plus className="w-5 h-5 text-amber-600 rotate-45" />
                            </div>
                            <h4 className="font-black text-[#0f172a] text-[11px] uppercase tracking-widest">Strategic Tip</h4>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">While metrics are strong, objective evidence of adoption by major tech firms will solidify 'Major Significance'.</p>
                    </div>
                </div>
            </div>
            <AttorneyActionModal
                isOpen={actionModal.isOpen}
                onClose={() => setActionModal({ ...actionModal, isOpen: false })}
                onSubmit={handleModalSubmit}
                actionType={actionModal.type}
                evidenceTitle={actionModal.title}
            />
        </div>
    );
};

