'use client';

import { useState } from 'react';
import { Send, Lock, UserPlus, ChevronDown } from 'lucide-react';
import { inviteTeamMember } from '@/app/actions/team';
import { toast } from 'sonner';

interface InviteFormProps {
    userPlan: string;
    memberCount: number;
    currentUserEmail: string;
}

const ROLES = [
    { value: 'attorney', label: 'Attorney' },
    { value: 'paralegal', label: 'Paralegal' },
    { value: 'consultant', label: 'Immigration Consultant' },
    { value: 'reviewer', label: 'Reviewer (Read-only)' },
];

export function InviteForm({ userPlan, memberCount, currentUserEmail }: InviteFormProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('attorney');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [emailError, setEmailError] = useState('');

    const planLevel = { Free: 0, Basic: 1, Premium: 2, Enterprise: 3 }[userPlan] ?? 0;
    const canInvite = planLevel >= 2;
    const isEnterprise = planLevel >= 3;
    const isPremiumLimited = planLevel === 2 && memberCount >= 1;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');

        if (!email.trim()) {
            setEmailError('Email is required');
            return;
        }

        // Email validation: basic regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        if (email.toLowerCase() === currentUserEmail.toLowerCase()) {
            setEmailError("You cannot invite yourself. Please enter a collaborator's email address.");
            return;
        }

        setLoading(true);
        try {
            const result = await inviteTeamMember({ email, role, message: message || undefined });
            if (result.success) {
                toast.success(`Invitation sent to ${email}`, {
                    action: { label: 'Undo', onClick: () => console.log('Undo logic here') }
                });
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
                    <div className="ml-auto flex items-center gap-2 group/tooltip relative">
                        <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                            {isEnterprise ? `Unlimited seats` : memberCount >= 1 ? `Need more seats? Upgrade to Enterprise` : `1 free collaborator seat`}
                        </span>
                        {!isEnterprise && (
                            <div className="absolute top-10 right-0 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20">
                                The Premium plan includes 1 free collaborator seat. Upgrade to Enterprise for unlimited seats.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                    <label htmlFor="invite-email" className="block text-sm font-bold text-[#1f2937] mb-2">Email Address</label>
                    <div className="relative">
                        <input
                            id="invite-email"
                            type="text"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError('');
                            }}
                            placeholder="Enter attorney's email address"
                            disabled={fieldsDisabled}
                            className={`w-full px-4 py-3 bg-white border ${emailError ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-300 focus:ring-[#1e3a8a]/20'} focus:border-[#1e3a8a] rounded-xl text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                        {email && !fieldsDisabled && (
                            <button type="button" onClick={() => setEmail('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <span className="text-lg font-bold">×</span>
                            </button>
                        )}
                    </div>
                    {emailError && <p className="text-xs text-red-500 font-bold mt-2">{emailError}</p>}
                </div>

                <div>
                    <label htmlFor="invite-role" className="block text-sm font-bold text-[#1f2937] mb-2">Role</label>
                    <div className="relative">
                        <div
                            className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all flex items-center justify-between cursor-pointer ${fieldsDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={() => !fieldsDisabled && setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                            tabIndex={0}
                            onBlur={() => setTimeout(() => setIsRoleDropdownOpen(false), 200)}
                        >
                            <span className="text-[#1f2937] font-medium">{ROLES.find(r => r.value === role)?.label}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Custom Dropdown */}
                        <div className={`absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl z-20 overflow-hidden transition-all duration-150 origin-top flex flex-col ${isRoleDropdownOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-95 opacity-0 invisible'}`}>
                            {ROLES.map((r) => (
                                <div
                                    key={r.value}
                                    className={`px-4 py-3 text-sm cursor-pointer border-l-2 hover:bg-slate-50 transition-colors ${role === r.value ? 'font-bold text-[#1e3a8a] border-[#1e3a8a] bg-blue-50/50' : 'font-medium text-[#1f2937] border-transparent'}`}
                                    onClick={() => {
                                        setRole(r.value);
                                        setIsRoleDropdownOpen(false);
                                    }}
                                >
                                    {r.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="invite-message" className="block text-sm font-bold text-[#1f2937]">Personal Message <span className="font-normal text-slate-500">(optional)</span></label>
                        <span className={`text-xs ${message.length > 500 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{message.length}/500 characters</span>
                    </div>
                    <textarea
                        id="invite-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                        placeholder="Hi [Name], I'd like you to review my EB-1A case. Looking forward to your feedback."
                        rows={3}
                        disabled={fieldsDisabled}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-[#1f2937] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none placeholder:text-slate-400"
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
