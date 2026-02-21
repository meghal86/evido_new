'use client';

import React from 'react';
import { Check, Shield, Zap, Award, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createCheckoutSession } from "@/app/actions/stripe";
import { Loader2 } from "lucide-react";

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
