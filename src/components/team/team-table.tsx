'use client';

import { useState } from 'react';
import { MoreVertical, RefreshCw, Trash2, Scale, ClipboardList, Briefcase, Eye, Users } from 'lucide-react';
import { removeTeamMember, resendInvite } from '@/app/actions/team';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TeamMember {
    id: string;
    invitedEmail: string;
    role: string;
    status: string;
    invitedAt: string | Date;
    acceptedAt: string | Date | null;
}

interface TeamTableProps {
    members: TeamMember[];
    canInvite: boolean;
}

const ROLE_CONFIG: Record<string, { icon: typeof Scale; label: string; color: string }> = {
    attorney: { icon: Scale, label: 'Attorney', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    paralegal: { icon: ClipboardList, label: 'Paralegal', color: 'text-purple-600 bg-purple-50 border-purple-100' },
    consultant: { icon: Briefcase, label: 'Consultant', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    reviewer: { icon: Eye, label: 'Reviewer', color: 'text-slate-600 bg-slate-50 border-slate-200' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
    active: { label: 'Active', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' },
    invited: { label: 'Invited', color: 'text-amber-700 bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
    inactive: { label: 'Inactive', color: 'text-red-700 bg-red-50 border-red-100', dot: 'bg-red-500' },
};

function getInitials(email: string): string {
    const name = email.split('@')[0];
    const parts = name.split(/[._-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

function scrollToInviteForm() {
    const emailInput = document.getElementById('invite-email');
    if (emailInput) {
        emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => emailInput.focus(), 400);
    }
}

export function TeamTable({ members, canInvite }: TeamTableProps) {
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const handleRemove = async (id: string) => {
        setActionLoading(id);
        setOpenMenu(null);
        try {
            const result = await removeTeamMember(id);
            if (result.success) toast.success('Team member removed');
            else toast.error(result.error || 'Failed to remove member');
        } catch {
            toast.error('Failed to remove member');
        } finally {
            setActionLoading(null);
        }
    };

    const handleResend = async (id: string) => {
        setActionLoading(id);
        setOpenMenu(null);
        try {
            const result = await resendInvite(id);
            if (result.success) toast.success('Invitation resent');
            else toast.error(result.error || 'Failed to resend invite');
        } catch {
            toast.error('Failed to resend invite');
        } finally {
            setActionLoading(null);
        }
    };

    // Empty state
    if (members.length === 0) {
        return (
            <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#0f172a] tracking-tight">My Case Team</h2>
                        <p className="text-sm font-medium text-slate-500">0 members</p>
                    </div>
                </div>
                <div className="p-12">
                    <div className="flex flex-col items-center text-center max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 border border-blue-100">
                            <Users className="w-10 h-10 text-[#1e3a8a]/40" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0f172a] mb-2">No team members yet</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Invite your immigration attorney to collaborate on your case. They'll be able to view evidence, download reports, and provide expert guidance.
                        </p>
                        {canInvite && (
                            <button
                                type="button"
                                onClick={scrollToInviteForm}
                                className="px-6 py-2.5 bg-[#1e3a8a] text-white font-bold text-sm rounded-xl hover:bg-[#162d6e] transition-all shadow-lg shadow-blue-900/10"
                            >
                                Invite First Member
                            </button>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // Members list
    return (
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#0f172a] tracking-tight">My Case Team</h2>
                        <p className="text-sm font-medium text-slate-500">{members.length} member{members.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {members.map((member) => {
                    const roleConf = ROLE_CONFIG[member.role] || ROLE_CONFIG.reviewer;
                    const statusConf = STATUS_CONFIG[member.status] || STATUS_CONFIG.invited;
                    const RoleIcon = roleConf.icon;
                    const isLoading = actionLoading === member.id;

                    return (
                        <div key={member.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-center gap-4 min-w-0">
                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-md">
                                    {getInitials(member.invitedEmail)}
                                </div>
                                {/* Info */}
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-[#0f172a] truncate">{member.invitedEmail}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${roleConf.color}`}>
                                            <RoleIcon className="w-3 h-3" />
                                            {roleConf.label}
                                        </span>
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${statusConf.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                                            {statusConf.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-xs text-slate-400 hidden sm:block">
                                    {format(new Date(member.invitedAt), 'MMM d, yyyy')}
                                </span>

                                {/* Actions menu */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                                        disabled={isLoading}
                                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                                        ) : (
                                            <MoreVertical className="w-4 h-4" />
                                        )}
                                    </button>

                                    {openMenu === member.id && (
                                        <>
                                            <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)} />
                                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                {member.status === 'invited' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleResend(member.id)}
                                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                        Resend Invite
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(member.id)}
                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
