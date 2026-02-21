'use client';

import { useState } from 'react';
import { Send, Lock, UserPlus, ChevronDown } from 'lucide-react';
import { inviteTeamMember } from '@/app/actions/team';
import { toast } from 'sonner';

interface InviteFormProps {
    userPlan: string;
    memberCount: number;
}

const ROLES = [
    { value: 'attorney', label: 'Attorney' },
    { value: 'paralegal', label: 'Paralegal' },
    { value: 'consultant', label: 'Immigration Consultant' },
    { value: 'reviewer', label: 'Reviewer (Read-only)' },
];

export function InviteForm({ userPlan, memberCount }: InviteFormProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('attorney');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const planLevel = { Free: 0, Basic: 1, Premium: 2, Enterprise: 3 }[userPlan] ?? 0;
    const canInvite = planLevel >= 2;
    const isEnterprise = planLevel >= 3;
    const isPremiumLimited = planLevel === 2 && memberCount >= 1;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            const result = await inviteTeamMember({ email, role, message: message || undefined });
            if (result.success) {
                toast.success(`Invitation sent to ${email}`);
                setEmail('');
                setMessage('');
            } else {
                toast.error(result.error || 'Failed to send invitation');
            }
        } catch {
            toast.error('Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    // Form fields disabled when plan doesn't allow or Premium limit reached
    const fieldsDisabled = !canInvite || isPremiumLimited;
    // Submit button disabled when fields disabled OR no email entered OR loading
    const submitDisabled = fieldsDisabled || loading || !email.trim();

    return (
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
            {/* Lock overlay for Free/Basic */}
            {!canInvite && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
                        <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="text-lg font-bold text-slate-800 mb-1">Unlock Team Collaboration</p>
                    <p className="text-sm text-slate-500 mb-4">Upgrade to Premium or Enterprise to invite team members</p>
                    <a
                        href="/upgrade"
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
                    >
                        Upgrade Now
                    </a>
                </div>
            )}

            <div className="p-8 border-b border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <UserPlus className="w-6 h-6 text-[#1e3a8a]" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Invite Collaborator</h2>
                    <p className="text-sm font-medium text-slate-500">Add attorneys, paralegals, or reviewers to your case.</p>
                </div>
                {canInvite && (
                    <div className="ml-auto">
                        <span className="text-xs font-bold text-slate-400">
                            {isEnterprise ? `${memberCount} member${memberCount !== 1 ? 's' : ''} · Unlimited seats` : `${memberCount}/1 seat used`}
                        </span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {isPremiumLimited && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                        <Lock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">Member limit reached</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                Premium allows 1 team member.{' '}
                                <a href="/upgrade" className="font-bold underline">Upgrade to Enterprise</a> for unlimited.
                            </p>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="invite-email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input
                        id="invite-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="attorney@lawfirm.com"
                        disabled={fieldsDisabled}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="invite-role" className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                    <div className="relative">
                        <select
                            id="invite-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={fieldsDisabled}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-10 cursor-pointer"
                        >
                            {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label htmlFor="invite-message" className="block text-sm font-bold text-slate-700 mb-2">Personal Message <span className="font-normal text-slate-400">(optional)</span></label>
                    <textarea
                        id="invite-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi, I'd like you to review my EB-1A case..."
                        rows={3}
                        disabled={fieldsDisabled}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitDisabled}
                    className="w-full py-3.5 bg-[#1e3a8a] text-white font-bold text-sm rounded-xl hover:bg-[#162d6e] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Send Invite
                        </>
                    )}
                </button>
            </form>
        </section>
    );
}
