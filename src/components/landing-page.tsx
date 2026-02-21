'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ShieldCheck, Github, Linkedin, Brain, FileText, ChevronRight, FolderOpen, Quote, Shield, Lock, Globe, Star, Zap, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface LandingPageProps {
    onStart?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const router = useRouter();

    const handleStart = () => {
        if (onStart) {
            onStart();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">
            {/* Navigation / Header */}
            <nav className="absolute top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center glass border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        {/* Fallback to icon if image missing, but try image first */}
                        <Image
                            src="/evido-logo.png"
                            alt="Evido Logo"
                            fill
                            className="object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <FolderOpen className="w-10 h-10 text-amber-500 hidden" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">Evido</span>
                </div>
                <button
                    onClick={() => router.push('/login')}
                    className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium backdrop-blur-sm"
                >
                    Client Login
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-gradient pt-20">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
                                <Star className="w-3 h-3" />
                                <span>Premium Evidence Generation</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
                                Claim Your <br />
                                <span className="text-gradient">Extraordinary Ability</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed font-light">
                                The world's first luxury legal-tech platform for EB-1A evidence.
                                powered by advanced AI to showcase your unique achievements.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button
                                    onClick={handleStart}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0f172a] font-bold rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.6)] hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-12"></div>
                                    <span className="relative flex items-center gap-2">
                                        Start Your Case <ChevronRight className="w-5 h-5" />
                                    </span>
                                </button>
                                <button className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white font-medium backdrop-blur-sm">
                                    View Sample Report
                                </button>
                            </div>

                            <div className="flex items-center gap-8 text-sm font-medium text-slate-400">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    <span>Attorney Trusted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-emerald-400" />
                                    <span>Bank-Level Security</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="relative hidden lg:block"
                    >
                        {/* Abstract Visual Representation of "Evidence" */}
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="luxury-card p-8 rounded-3xl h-full border-white/10 flex flex-col justify-center items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-20">
                                    <Quote size={120} className="text-white" />
                                </div>
                                <div className="glass p-6 rounded-2xl mb-6 w-full max-w-xs transform -rotate-3 border-amber-500/20">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                                        <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                        <div className="h-2 w-5/6 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-2xl w-full max-w-xs transform rotate-3 z-10 border-white/20 shadow-2xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Analysis Complete</span>
                                        <Award className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Extraordinary Ability</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                        Candidate meets 4/10 criteria with high confidence. Evidence strength is exceptional.
                                    </p>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-amber-400 to-amber-600 w-[85%] h-full rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-white/5 bg-[#0f172a]/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <Stat label="Petitions" value="500+" />
                    <Stat label="Success Rate" value="98%" />
                    <Stat label="Time Saved" value="40h+" />
                    <Stat label="Partner Firms" value="12" />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-base font-bold text-amber-500 uppercase tracking-widest mb-3">Refined Intelligence</h2>
                        <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                            Engineered for Excellence
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-amber-400" />}
                            title="Instant Integration"
                            description="Connect GitHub, LinkedIn, and Scholar in seconds. Our engine automatically parses years of work history."
                        />
                        <FeatureCard
                            icon={<Brain className="w-6 h-6 text-amber-400" />}
                            title="Criteria Matching"
                            description="Deep learning models map your achievements specifically to US immigration criteria (EB-1A/O-1)."
                        />
                        <FeatureCard
                            icon={<FileText className="w-6 h-6 text-amber-400" />}
                            title="Dossier Generation"
                            description="Export a perfectly formatted, attorney-ready evidence packet. Save weeks of manual documentation."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works - Elegant Steps */}
            <section className="py-24 bg-[#0b1120]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                From Chaos to <span className="text-amber-500">Clarity</span>
                            </h2>
                            <div className="space-y-8">
                                <Step number="01" title="Connect Sources" desc="Securely link your professional platforms." />
                                <Step number="02" title="AI Extraction" desc="We identify critical evidence and achievements." />
                                <Step number="03" title="Review & Export" desc="Fine-tune your narrative and download the PDF." />
                            </div>
                        </div>
                        <div className="luxury-card p-2 rounded-3xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                            {/* Decorative placeholder for UI screenshot */}
                            <div className="aspect-[4/3] rounded-2xl bg-[#0f172a] overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center mx-auto mb-4">
                                            <FolderOpen className="text-amber-500" />
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium">Interactive Evidence Dashboard</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f172a] border-t border-white/5 py-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">Evido</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-400">Beta</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © 2026 Evido Platform. Crafted for distinctive talent.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const Stat = ({ label, value }: { label: string, value: string }) => (
    <div className="text-center">
        <div className="text-4xl font-bold text-white mb-1 tracking-tight">{value}</div>
        <div className="text-xs text-amber-500/80 uppercase tracking-widest font-bold">{label}</div>
    </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="luxury-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-amber-500/50 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
    <div className="flex gap-6 group">
        <div className="text-3xl font-bold text-white/10 group-hover:text-amber-500/50 transition-colors">
            {number}
        </div>
        <div>
            <h4 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{title}</h4>
            <p className="text-slate-400 text-sm">{desc}</p>
        </div>
    </div>
);
