'use client';

import React, { useState } from 'react';
import { User, CreditCard, Shield, ChevronRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { AttorneyInvite } from './settings/attorney-invite';

interface SettingsProps {
    initialUser: any;
}

export const Settings: React.FC<SettingsProps> = ({ initialUser }) => {
    const [formData, setFormData] = useState({
        name: initialUser?.name || '',
        email: initialUser?.email || '',
        notifications: true,
        twoFactor: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPurgeModal, setShowPurgeModal] = useState(false);
    const [purging, setPurging] = useState(false);

    const handlePurge = async () => {
        setPurging(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPurging(false);
        setShowPurgeModal(false);
        toast.success("Data purge simulations complete");
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Purge Modal */}
            {showPurgeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowPurgeModal(false)} />
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-[#0f172a]">Permanently Delete Data?</h3>
                                <p className="text-slate-500 font-medium">
                                    This action is <span className="text-red-600 font-bold">irreversible</span>. All unconnected evidence, drafted letters, and AI analysis reports will be immediately destroyed.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={() => setShowPurgeModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePurge}
                                    disabled={purging}
                                    className="flex-1 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                >
                                    {purging ? "Destroying..." : "Confirm Purge"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="pb-8 border-b border-slate-200/50">
                <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-2">Account Settings</h2>
                <p className="text-slate-500 font-medium">Manage your professional profile, preferences, and agency subscription.</p>
            </div>

            <div className="space-y-8">
                <section className="glass rounded-[2.5rem] overflow-hidden hover:premium-shadow transition-all duration-500">
                    <div className="px-8 py-6 border-b border-slate-100/50 flex items-center gap-4 bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <User className="w-5 h-5 text-[#1e3a8a]" />
                        </div>
                        <h3 className="font-black text-[#0f172a] text-sm uppercase tracking-widest">Profile Identity</h3>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-blue-100 focus:border-[#1e3a8a] outline-none transition-all font-medium text-[#0f172a] shadow-sm"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Verified Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-8 py-3.5 bg-[#1e3a8a] text-white text-xs font-black rounded-xl shadow-lg shadow-blue-900/10 hover:premium-shadow hover:-translate-y-0.5 transition-all duration-300 active-click uppercase tracking-widest"
                        >
                            {isLoading ? 'Processing...' : 'Sync Profile Changes'}
                        </button>
                    </div>
                </section>

                <section className="glass rounded-[2.5rem] overflow-hidden hover:premium-shadow transition-all duration-500">
                    <div className="px-8 py-6 border-b border-slate-100/50 flex items-center gap-4 bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-[#1e3a8a]" />
                        </div>
                        <h3 className="font-black text-[#0f172a] text-sm uppercase tracking-widest">Membership Status</h3>
                    </div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200/50 mb-6 group hover:bg-white hover:border-blue-200 transition-all duration-500">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-black text-[#0f172a] text-lg">Evido Free Tier</p>
                                    <div className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] font-black uppercase">Current</div>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Standard automated evidence tracking.</p>
                            </div>
                            <button className="px-6 py-2.5 bg-white text-[#1e3a8a] text-[11px] font-black rounded-xl border border-blue-100 hover:bg-blue-50 transition-all shadow-sm active-click uppercase tracking-widest">
                                Upgrade Plan
                            </button>
                        </div>
                        <button className="flex items-center gap-2 text-[#1e3a8a] font-black text-[11px] hover:text-[#1e40af] transition-colors uppercase tracking-[0.2em] ml-1">
                            Billing History <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

                {/* Attorney Invite Section (P0 Feature) */}
                <AttorneyInvite />

                <section className="glass rounded-[2.5rem] overflow-hidden hover:premium-shadow transition-all duration-500">
                    <div className="px-8 py-6 border-b border-slate-100/50 flex items-center gap-4 bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <Shield className="w-5 h-5 text-[#f43f5f]" />
                        </div>
                        <h3 className="font-black text-[#0f172a] text-sm uppercase tracking-widest">Nexus Security</h3>
                    </div>
                    <div className="p-8 space-y-2">
                        <div className="flex items-center justify-between py-5 border-b border-slate-100/50 group">
                            <div>
                                <p className="font-black text-[#0f172a] text-[15px] group-hover:text-blue-900 transition-colors">Multi-Factor Authentication</p>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">Protect your legal evidence with biometric sync.</p>
                            </div>
                            <button className="px-4 py-2 text-[11px] font-black text-[#1e3a8a] uppercase tracking-widest hover:bg-blue-50 rounded-lg transition-all">Enable</button>
                        </div>
                        <div className="flex items-center justify-between py-5 group">
                            <div>
                                <p className="font-black text-[#0f172a] text-[15px] group-hover:text-red-900 transition-colors">Purge Data Nexus</p>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">Permanently remove all evidence and profiles.</p>
                            </div>
                            <button
                                onClick={() => setShowPurgeModal(true)}
                                className="px-4 py-2 text-[11px] font-black text-red-600 uppercase tracking-widest hover:bg-red-50 rounded-lg transition-all"
                            >
                                Destroy
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
