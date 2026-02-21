'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Award, Atom, Briefcase, Palette, Trophy, HelpCircle,
    Rocket, Clock, CheckCircle, AlertTriangle,
    Github, ArrowRight, ArrowLeft, Sparkles, Zap
} from 'lucide-react';
import { savePetitionerOnboarding } from '@/app/actions/onboarding';
import { toast } from 'sonner';

const STEPS = 5;

const VISA_OPTIONS = [
    { id: 'EB-1A', label: 'EB-1A', sub: 'Extraordinary Ability', icon: Award, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'O-1A', label: 'O-1A', sub: 'Extraordinary Ability (Nonimmigrant)', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'EB-2 NIW', label: 'EB-2 NIW', sub: 'National Interest Waiver', icon: Zap, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'unsure', label: 'Not sure yet', sub: 'Help me figure it out', icon: HelpCircle, color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

const FIELD_OPTIONS = [
    { id: 'engineering', label: 'Engineering & Technology', emoji: '💻', color: 'bg-blue-50 border-blue-200' },
    { id: 'sciences', label: 'Sciences & Research', emoji: '🔬', color: 'bg-emerald-50 border-emerald-200' },
    { id: 'business', label: 'Business & Finance', emoji: '💼', color: 'bg-amber-50 border-amber-200' },
    { id: 'arts', label: 'Arts & Entertainment', emoji: '🎨', color: 'bg-pink-50 border-pink-200' },
    { id: 'athletics', label: 'Athletics', emoji: '🏆', color: 'bg-orange-50 border-orange-200' },
    { id: 'other', label: 'Other', emoji: '📋', color: 'bg-slate-50 border-slate-200' },
];

const STAGE_OPTIONS = [
    { id: 'starting', label: 'Just starting', sub: "I haven't gathered evidence yet", icon: Rocket, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'in_progress', label: 'In progress', sub: 'I have some evidence ready', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'almost_ready', label: 'Almost ready', sub: 'I need to finalize my petition', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'filed_rfe', label: 'Already filed', sub: 'I received an RFE', icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' },
];

export default function PetitionerOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        target_visa: '',
        field_of_work: '',
        case_stage: '',
        github_username: '',
    });

    const canContinue = () => {
        if (step === 1) return !!data.target_visa;
        if (step === 2) return !!data.field_of_work;
        if (step === 3) return !!data.case_stage;
        return true;
    };

    const handleFinish = async () => {
        setSaving(true);
        const result = await savePetitionerOnboarding(data);
        if (result.success) {
            toast.success('Welcome to Evido!');
            router.push('/');
        } else {
            toast.error(result.error || 'Failed to save');
        }
        setSaving(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </div>
                            <span className="font-black text-lg text-[#0f172a]">Evido</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">Step {step} of {STEPS}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#1e3a8a] to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${(step / STEPS) * 100}%` }}
                        />
                    </div>
                    {/* Step dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: STEPS }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${i + 1 === step ? 'bg-[#1e3a8a] scale-125' :
                                        i + 1 < step ? 'bg-blue-400' : 'bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8">
                        {/* STEP 1 — Visa */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">What visa are you targeting?</h2>
                                    <p className="text-sm text-slate-500">This helps us customize your criteria tracking.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {VISA_OPTIONS.map((opt) => {
                                        const Icon = opt.icon;
                                        const selected = data.target_visa === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setData({ ...data, target_visa: opt.id })}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selected ? `${opt.color} shadow-md` : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? '' : 'bg-slate-50'}`}>
                                                    <Icon className={`w-6 h-6 ${selected ? '' : 'text-slate-400'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#0f172a]">{opt.label}</p>
                                                    <p className="text-xs text-slate-500">{opt.sub}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* STEP 2 — Field */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">What is your field?</h2>
                                    <p className="text-sm text-slate-500">We'll tailor evidence examples to your domain.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {FIELD_OPTIONS.map((opt) => {
                                        const selected = data.field_of_work === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setData({ ...data, field_of_work: opt.id })}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${selected ? `${opt.color} shadow-md` : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <span className="text-2xl">{opt.emoji}</span>
                                                <p className="text-sm font-bold text-[#0f172a]">{opt.label}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* STEP 3 — Stage */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">Where are you in the process?</h2>
                                    <p className="text-sm text-slate-500">This helps us prioritize your next steps.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {STAGE_OPTIONS.map((opt) => {
                                        const Icon = opt.icon;
                                        const selected = data.case_stage === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setData({ ...data, case_stage: opt.id })}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selected ? `${opt.color} shadow-md` : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? '' : 'bg-slate-50'}`}>
                                                    <Icon className={`w-6 h-6 ${selected ? '' : 'text-slate-400'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#0f172a]">{opt.label}</p>
                                                    <p className="text-xs text-slate-500">{opt.sub}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* STEP 4 — GitHub */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">Connect GitHub</h2>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                        We'll automatically detect evidence for your Original Contributions and Leading Role criteria.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center">
                                        <Github className="w-10 h-10 text-white" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // In a real app, this would trigger OAuth
                                            toast.info('GitHub connect will be available after setup.');
                                            setData({ ...data, github_username: 'connected' });
                                        }}
                                        className="px-8 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-all flex items-center gap-2"
                                    >
                                        <Github className="w-4 h-4" />
                                        Connect GitHub Account
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(5)}
                                        className="text-sm text-slate-400 font-bold hover:text-slate-600 transition-colors"
                                    >
                                        I'll connect later →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 5 — Summary */}
                        {step === 5 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">You're all set!</h2>
                                    <p className="text-sm text-slate-500">Here's your case setup summary.</p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Visa</span>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg border border-blue-100">
                                            {data.target_visa || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field</span>
                                        <span className="text-sm font-bold text-[#0f172a] capitalize">
                                            {FIELD_OPTIONS.find(f => f.id === data.field_of_work)?.label || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</span>
                                        <span className="text-sm font-bold text-[#0f172a]">
                                            {STAGE_OPTIONS.find(s => s.id === data.case_stage)?.label || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub</span>
                                        <span className={`text-sm font-bold ${data.github_username ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {data.github_username ? '✓ Connected' : 'Not connected'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleFinish}
                                    disabled={saving}
                                    className="w-full py-4 bg-[#1e3a8a] text-white font-black text-sm rounded-xl hover:bg-[#162d6e] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Go to My Dashboard
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    {step < 5 && (
                        <div className="px-8 pb-8 flex items-center justify-between">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                            ) : <div />}
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                disabled={!canContinue()}
                                className="px-8 py-3 bg-[#1e3a8a] text-white font-bold text-sm rounded-xl hover:bg-[#162d6e] transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
