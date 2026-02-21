'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, UserPlus, Shield } from 'lucide-react';
import { inviteAttorney } from '@/app/actions/attorney';
import { toast } from 'sonner';

export const AttorneyInvite = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [invited, setInvited] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await inviteAttorney(email);

        if (result.success) {
            toast.success("Invitation sent to attorney");
            setInvited(true);
            setEmail('');
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1e3a8a] flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#0f172a]">Attorney Collaboration</h3>
                        <p className="text-sm text-slate-500 font-medium">Invite your lawyer to review evidence and lock your case.</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {invited ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-900">Invitation Sent!</h4>
                            <p className="text-sm text-emerald-700">Your attorney has been notified. They will appear here once they accept.</p>
                            <button
                                onClick={() => setInvited(false)}
                                className="text-xs font-black text-emerald-600 uppercase tracking-widest mt-2 hover:underline"
                            >
                                Send another invite
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleInvite} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Attorney Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="lawyer@firm.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50/50 rounded-xl p-4 text-sm text-blue-900/70 leading-relaxed border border-blue-100/50">
                            <strong>Note:</strong> Your attorney will have read-only access to your evidence until you grant editing permissions. They can approve items and lock them for the petition.
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#1e3a8a] text-white font-black rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-pulse">Sending Invite...</span>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Send Invitation
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
