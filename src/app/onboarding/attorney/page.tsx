'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2, Hash, Clock, CheckCircle, Scale,
    ArrowRight, ArrowLeft, Mail, Zap, Shield
} from 'lucide-react';
import { saveAttorneyOnboarding } from '@/app/actions/onboarding';
import { toast } from 'sonner';

const STEPS = 4;

const SPECIALIZATION_OPTIONS = [
    { id: 'EB-1A', label: 'EB-1A Extraordinary Ability' },
    { id: 'O-1', label: 'O-1 Extraordinary Ability' },
    { id: 'EB-2 NIW', label: 'EB-2 National Interest Waiver' },
    { id: 'EB-1B', label: 'EB-1B Outstanding Researcher' },
    { id: 'other', label: 'Other Employment-Based' },
];

const EXPERIENCE_OPTIONS = [
    { id: '1-2', label: '1–2 years' },
    { id: '3-5', label: '3–5 years' },
    { id: '6-10', label: '6–10 years' },
    { id: '10+', label: '10+ years' },
];

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
    'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
    'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

export default function AttorneyOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        firm_name: '',
        bar_number: '',
        years_experience: '',
        specialization: [] as string[],
        states_licensed: [] as string[],
        professional_email: '',
    });

    const canContinue = () => {
        if (step === 1) return !!data.firm_name && !!data.years_experience;
        if (step === 2) return data.specialization.length > 0;
        return true;
    };

    const toggleSpec = (id: string) => {
        setData(prev => ({
            ...prev,
            specialization: prev.specialization.includes(id)
                ? prev.specialization.filter(s => s !== id)
                : [...prev.specialization, id],
        }));
    };

    const toggleState = (st: string) => {
        setData(prev => ({
            ...prev,
            states_licensed: prev.states_licensed.includes(st)
                ? prev.states_licensed.filter(s => s !== st)
                : [...prev.states_licensed, st],
        }));
    };

    const handleFinish = async () => {
        setSaving(true);
        const result = await saveAttorneyOnboarding(data);
        if (result.success) {
            toast.success('Welcome to Evido!');
            router.push('/attorney/cases');
        } else {
            toast.error(result.error || 'Failed to save');
        }
        setSaving(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </div>
                            <span className="font-black text-lg text-[#0f172a]">Evido</span>
                            <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">Attorney</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">Step {step} of {STEPS}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${(step / STEPS) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: STEPS }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${i + 1 === step ? 'bg-amber-500 scale-125' :
                                        i + 1 < step ? 'bg-amber-400' : 'bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8">
                        {/* STEP 1 — Profile Setup */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">Set up your attorney profile</h2>
                                    <p className="text-sm text-slate-500">This information helps clients find and trust you.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            <Building2 className="w-4 h-4 inline mr-1.5 text-slate-400" />
                                            Law Firm Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.firm_name}
                                            onChange={(e) => setData({ ...data, firm_name: e.target.value })}
                                            placeholder="Smith & Associates LLP"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            <Hash className="w-4 h-4 inline mr-1.5 text-slate-400" />
                                            Bar Number / License Number <span className="font-normal text-slate-400">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.bar_number}
                                            onChange={(e) => setData({ ...data, bar_number: e.target.value })}
                                            placeholder="12345678"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                        />
                                        {data.bar_number && (
                                            <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                You'll receive a "Verified Attorney" badge
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            <Clock className="w-4 h-4 inline mr-1.5 text-slate-400" />
                                            Years of Immigration Experience
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {EXPERIENCE_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setData({ ...data, years_experience: opt.id })}
                                                    className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${data.years_experience === opt.id
                                                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                            : 'border-slate-100 text-slate-500 hover:border-slate-200'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 — Specialization */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">Your specialization</h2>
                                    <p className="text-sm text-slate-500">Select all visa categories you handle.</p>
                                </div>

                                <div className="space-y-3">
                                    {SPECIALIZATION_OPTIONS.map(opt => {
                                        const selected = data.specialization.includes(opt.id);
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => toggleSpec(opt.id)}
                                                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${selected
                                                        ? 'border-amber-500 bg-amber-50 shadow-md'
                                                        : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                                                    }`}>
                                                    {selected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <span className="text-sm font-bold text-[#0f172a]">{opt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* States */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3">States Licensed</label>
                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        {US_STATES.map(st => {
                                            const selected = data.states_licensed.includes(st);
                                            return (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    onClick={() => toggleState(st)}
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${selected
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-white text-slate-500 border border-slate-200 hover:border-amber-300'
                                                        }`}
                                                >
                                                    {st}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {data.states_licensed.length > 0 && (
                                        <p className="text-xs text-amber-600 font-bold mt-2">
                                            {data.states_licensed.length} state{data.states_licensed.length !== 1 ? 's' : ''} selected
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 3 — How clients find you */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">How you'll receive cases</h2>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                        Clients using Evido will invite you to collaborate on their cases. You'll receive an email notification.
                                    </p>
                                </div>

                                {/* Preview of invite */}
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invite Preview</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-slate-100 space-y-2">
                                        <p className="text-xs font-bold text-slate-400">Subject:</p>
                                        <p className="text-sm font-bold text-[#0f172a]">You've been invited to collaborate on an EB-1A petition in Evido</p>
                                        <hr className="border-slate-100" />
                                        <p className="text-xs text-slate-500">
                                            A client has invited you to review their EB-1A Extraordinary Ability case. Click the link below to join their team and start reviewing evidence.
                                        </p>
                                        <div className="bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-lg text-center border border-blue-100">
                                            Accept Invitation →
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Your professional email for client invitations
                                    </label>
                                    <input
                                        type="email"
                                        value={data.professional_email}
                                        onChange={(e) => setData({ ...data, professional_email: e.target.value })}
                                        placeholder="attorney@lawfirm.com"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 4 — Summary */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                                        <Scale className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#0f172a] mb-2">You're ready!</h2>
                                    <p className="text-sm text-slate-500">Your attorney profile summary.</p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Firm</span>
                                        <span className="text-sm font-bold text-[#0f172a]">{data.firm_name || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bar Number</span>
                                        <span className="text-sm font-bold text-[#0f172a]">
                                            {data.bar_number ? (
                                                <span className="flex items-center gap-1.5">
                                                    {data.bar_number}
                                                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                                </span>
                                            ) : 'Not provided'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</span>
                                        <span className="text-sm font-bold text-[#0f172a]">{data.years_experience} years</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specializations</span>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {data.specialization.map(s => (
                                                <span key={s} className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-100">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {data.states_licensed.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Licensed in</span>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {data.states_licensed.map(st => (
                                                    <span key={st} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                                                        {st}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleFinish}
                                    disabled={saving}
                                    className="w-full py-4 bg-amber-500 text-white font-black text-sm rounded-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Go to My Cases
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    {step < 4 && (
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
                                className="px-8 py-3 bg-amber-500 text-white font-bold text-sm rounded-xl hover:bg-amber-600 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
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
