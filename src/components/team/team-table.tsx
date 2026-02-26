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
            <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-dashed border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="p-8 border-b border-slate-100/50 flex items-center gap-4 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Your Team Dashboard</h2>
                        <p className="text-sm font-medium text-slate-500">Awaiting your first connection</p>
                    </div>
                </div>
                <div className="p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="flex flex-col items-center text-center max-w-lg mx-auto relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 mb-6 group-hover:bg-slate-200 transition-colors">
                            <Users className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0f172a] mb-4">Once you invite a team member, you'll see them here with:</h3>

                        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8 text-left space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0" />
                                <div className="space-y-1 flex-1">
                                    <div className="w-1/3 h-2 bg-slate-200 rounded" />
                                    <div className="w-1/4 h-2 bg-slate-100 rounded" />
                                </div>
                            </div>
                            <ul className="space-y-3 pl-2">
                                <li className="flex items-center gap-2 text-sm text-slate-500 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Name and assigned role</li>
                                <li className="flex items-center gap-2 text-sm text-slate-500 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Current invitation status</li>
                                <li className="flex items-center gap-2 text-sm text-slate-500 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Quick actions to edit or remove</li>
                            </ul>
                        </div>

                        {canInvite && (
                            <button
                                type="button"
                                onClick={scrollToInviteForm}
                                className="px-6 py-3 bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold text-sm rounded-xl hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2 group"
                            >
                                <span className="group-hover:-translate-y-0.5 transition-transform">Invite Your First Team Member</span>
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
