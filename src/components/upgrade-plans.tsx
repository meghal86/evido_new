'use client';

import React from 'react';
import { Check, Shield, Zap, Award, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createCheckoutSession } from "@/app/actions/stripe";
import { Loader2, Lock } from "lucide-react";

interface UpgradePlansProps {
    onSelect?: (plan: string) => void;
    userPlan?: string;
}

const PLAN_LEVELS: Record<string, number> = {
    'Free': 0,
    'Basic': 1,
    'Premium': 2,
    'Enterprise': 3
};

export const UpgradePlans: React.FC<UpgradePlansProps> = ({ onSelect, userPlan = "Free" }) => {
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);

    const currentLevel = PLAN_LEVELS[userPlan] || 0;

    const getPlanStatus = (planName: string) => {
        const planLevel = PLAN_LEVELS[planName] || 0;
        if (planName === userPlan) return { label: "Current Plan", disabled: true };
        if (currentLevel > planLevel) return { label: "Downgrade", disabled: false };
        return { label: "Get Started", disabled: false };
    };

    const handleSelect = async (plan: string) => {
        if (onSelect) {
            onSelect(plan);
            return;
        }

        const status = getPlanStatus(plan);
        if (status.disabled) return;

        setLoadingPlan(plan);
        try {
            const result = await createCheckoutSession(plan);
            if (result.success && result.url) {
                toast.success("Redirecting to secure checkout...");
                router.push(result.url);
            } else {
                toast.error(result.error || "Failed to initialize payment. Please try again.");
                setLoadingPlan(null);
            }
        } catch (error: any) {
            toast.error(error?.message || "Payment initialization failed");
            setLoadingPlan(null);
        }
    };

    return (
        <div className="pt-32 lg:pt-28 pb-12 px-4 lg:px-8 max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-black text-[#1e293b] mb-4">Choose Your Path to Success</h2>
                <p className="text-[#64748b] text-lg lg:text-xl max-w-2xl mx-auto">Select a plan that fits your timeline and career complexity. Most successful applicants choose the Premium tier for full legal readiness.</p>
                {userPlan !== 'Free' && (
                    <div className="mt-4 inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                        Current Plan: {userPlan}
                    </div>
                )}
            </div>

            {/* Sample Report Preview Segment */}
            <div className="mb-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden group">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group-hover:bg-slate-100 transition-colors">
                    {/* Blurred document placeholder */}
                    <div className="w-full max-w-sm aspect-[3/4] bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col gap-4 relative overflow-hidden">
                        <div className="w-1/3 h-4 bg-slate-200 rounded animate-pulse" />
                        <div className="w-2/3 h-8 bg-slate-300 rounded mb-4" />

                        <div className="flex-1 filter blur-[4px] opacity-70 space-y-4">
                            <div className="w-full h-3 bg-slate-200 rounded" />
                            <div className="w-5/6 h-3 bg-slate-200 rounded" />
                            <div className="w-full h-3 bg-slate-200 rounded" />
                            <div className="w-4/6 h-3 bg-slate-200 rounded" />
                            <div className="w-full h-12 bg-blue-50/50 rounded flex gap-2 p-2 mt-4 mt-8">
                                <div className="w-8 h-8 bg-blue-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="w-1/2 h-2 bg-blue-200 rounded" />
                                    <div className="w-1/4 h-2 bg-blue-200 rounded" />
                                </div>
                            </div>
                            <div className="w-full h-3 bg-slate-200 rounded mt-4" />
                            <div className="w-5/6 h-3 bg-slate-200 rounded" />
                        </div>

                        {/* Lock Overlay */}
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center flex-col transition-all duration-300 group-hover:backdrop-blur-[1px]">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3">
                                <Lock className="w-8 h-8 text-amber-500" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-[#1e293b] bg-white px-3 py-1 rounded-full shadow-sm">Sample Report</span>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-black text-[#1e293b] mb-4">See exactly what you get.</h3>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6">
                        Our Full Analysis Reports are generated using attorney-vetted logic, evaluating your evidence exactly like USCIS officers do. You get a downloadable PDF detailing every gap, strong point, and a tailored strategy to build your case.
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <Check className="w-4 h-4 text-emerald-500" /> 10-Criterion Mapping
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <Check className="w-4 h-4 text-emerald-500" /> Probability Scores for EB-1A, O-1, NIW
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <Check className="w-4 h-4 text-emerald-500" /> AI-Drafted Cover Letter Excerpts
                        </li>
                    </ul>
                    <a href="#plans" className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">
                        View Packages <ChevronRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PlanCard
                    tier="Basic"
                    price="$99"
                    description="Perfect for individual engineers starting their petition journey."
                    features={[
                        "Full 10-Criteria Analysis",
                        "AI-Generated Evidence Text",
                        "Draft PDF Report Download",
                        "Citation Tracker",
                        "Email Support"
                    ]}
                    onSelect={() => handleSelect('Basic')}
                    icon={<Zap className="w-6 h-6 text-blue-500" />}
                    cta={getPlanStatus('Basic').label}
                    disabled={getPlanStatus('Basic').disabled}
                />

                <PlanCard
                    tier="Premium"
                    price="$299"
                    featured={true}
                    activeLoading={loadingPlan}
                    description="Our most popular choice for senior staff and principal engineers."
                    features={[
                        "Everything in Basic",
                        "Attorney-Ready Cover Letters",
                        "Expert Review Scoring",
                        "GitHub/Scholar Auto-Sync",
                        "Priority Support",
                        "Custom Exhibit Formatting"
                    ]}
                    onSelect={() => handleSelect('Premium')}
                    icon={<Award className="w-6 h-6 text-amber-500" />}
                    cta={getPlanStatus('Premium').label}
                    disabled={getPlanStatus('Premium').disabled}
                />

                <PlanCard
                    tier="Enterprise"
                    price="$499"
                    description="Best for law firms and teams managing multiple petitions."
                    features={[
                        "Everything in Premium",
                        "Team Management",
                        "Priority Support",
                        "Custom Integrations",
                        "White-label Reports",
                        "Multi-user Workspace"
                    ]}
                    onSelect={() => handleSelect('Enterprise')}
                    icon={<Shield className="w-6 h-6 text-[#f59e0b]" />}
                    priceSuffix="/month"
                    cta={getPlanStatus('Enterprise').label}
                    disabled={getPlanStatus('Enterprise').disabled}
                    isGold={true}
                />
            </div>

            <div className="mt-20 bg-slate-100 rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-xl lg:text-2xl font-black text-[#1e293b] mb-2 text-center md:text-left">Not sure which one is right for you?</h3>
                    <p className="text-[#64748b] text-center md:text-left">Schedule a 15-minute consultation with our product specialists.</p>
                </div>
                <button className="w-full md:w-auto px-8 py-4 bg-white text-[#1e293b] font-black rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
                    Or schedule custom demo →
                </button>
            </div>
        </div>
    );
};

const PlanCard = ({ tier, price, description, features, featured = false, onSelect, icon, cta = "Get Started", priceSuffix = "/once", isGold = false, activeLoading = null, disabled = false }: any) => (
    <motion.div
        whileHover={{ y: -8 }}
        className={`p-8 rounded-3xl border ${featured ? 'border-[#1e3a8a] ring-8 ring-blue-50 shadow-xl' : isGold ? 'border-[#f59e0b] ring-8 ring-amber-50 shadow-xl' : 'border-slate-200 shadow-sm'} bg-white flex flex-col relative overflow-hidden ${disabled ? 'opacity-70 grayscale-[0.5]' : ''}`}
    >
        {featured && <div className="absolute top-0 right-0 bg-[#1e3a8a] text-white text-[10px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest">Recommended</div>}
        {isGold && <div className="absolute top-0 right-0 bg-[#f59e0b] text-[#1e3a8a] text-[10px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest">Teams</div>}

        <div className="mb-6 flex items-center justify-between">
            <div className="p-3 bg-slate-50 rounded-2xl">
                {icon}
            </div>
        </div>

        <h3 className="text-2xl font-black text-[#1e293b] mb-2">{tier}</h3>
        <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-black text-[#1e293b]">{price}</span>
            <span className="text-[#64748b] font-bold text-sm">{priceSuffix}</span>
        </div>
        <p className="text-[#64748b] text-sm mb-8 leading-relaxed font-medium">{description}</p>

        <ul className="space-y-4 mb-10 flex-grow">
            {features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#1e293b] font-medium">
                    <div className={`mt-0.5 p-0.5 rounded-full ${featured ? 'bg-blue-100 text-[#1e3a8a]' : isGold ? 'bg-amber-100 text-[#f59e0b]' : 'bg-slate-100 text-slate-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                    </div>
                    {f}
                </li>
            ))}
        </ul>

        <button
            onClick={onSelect}
            disabled={disabled || !!activeLoading}
            className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${disabled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : featured
                    ? 'bg-[#1e3a8a] text-white hover:bg-[#1e40af] shadow-lg shadow-blue-200'
                    : isGold
                        ? 'bg-[#f59e0b] text-[#1e3a8a] hover:bg-[#d97706] shadow-lg shadow-amber-200'
                        : 'bg-slate-100 text-[#1e293b] hover:bg-slate-200'
                }`}
        >
            {activeLoading === tier ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                    {cta} {!disabled && <ChevronRight className="w-4 h-4" />}
                </>
            )}
        </button>
    </motion.div>
);
