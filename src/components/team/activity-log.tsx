'use client';

import { useState } from 'react';
import { Activity, Eye, Download, Edit, UserPlus, UserCheck, UserX, FileText, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

interface LogEntry {
    id: string;
    actorName: string;
    actionType: string;
    actionDetails: any;
    createdAt: string | Date;
    teamMember?: {
        invitedEmail: string;
        role: string;
    } | null;
}

interface ActivityLogProps {
    logs: LogEntry[];
    isEnterprise: boolean;
}

const ACTION_CONFIG: Record<string, { icon: typeof Eye; label: string; color: string }> = {
    invited: { icon: UserPlus, label: 'was invited to the team', color: 'text-blue-500 bg-blue-50' },
    accepted: { icon: UserCheck, label: 'accepted team invitation', color: 'text-emerald-500 bg-emerald-50' },
    invite_resent: { icon: UserPlus, label: 'invite was resent', color: 'text-amber-500 bg-amber-50' },
    member_removed: { icon: UserX, label: 'was removed from the team', color: 'text-red-500 bg-red-50' },
    viewed_page: { icon: Eye, label: 'viewed a page', color: 'text-indigo-500 bg-indigo-50' },
    downloaded_report: { icon: Download, label: 'downloaded a report', color: 'text-purple-500 bg-purple-50' },
    edited_criteria: { icon: Edit, label: 'edited criteria', color: 'text-teal-500 bg-teal-50' },
    generated_report: { icon: FileText, label: 'generated a report', color: 'text-cyan-500 bg-cyan-50' },
};

function getActionDescription(log: LogEntry): string {
    const email = log.actionDetails?.email || log.teamMember?.invitedEmail || '';
    const role = log.actionDetails?.role || log.teamMember?.role || '';

    switch (log.actionType) {
        case 'invited':
            return `${log.actorName} invited ${email} as ${role}`;
        case 'accepted':
            return `${email} (${role}) accepted team invitation`;
        case 'invite_resent':
            return `${log.actorName} resent invitation to ${email}`;
        case 'member_removed':
            return `${log.actorName} removed ${email} from the team`;
        case 'viewed_page':
            return `${log.actorName} viewed ${log.actionDetails?.page || 'a page'}`;
        case 'downloaded_report':
            return `${log.actorName} downloaded ${log.actionDetails?.filename || 'a report'}`;
        default:
            return `${log.actorName} ${ACTION_CONFIG[log.actionType]?.label || log.actionType}`;
    }
}

const FILTER_OPTIONS = [
    { value: 7, label: 'Last 7 Days' },
    { value: 30, label: 'Last 30 Days' },
    { value: 365, label: 'Full History' },
];

export function ActivityLog({ logs, isEnterprise }: ActivityLogProps) {
    const [filterDays, setFilterDays] = useState(isEnterprise ? 365 : 30);
    const [filterOpen, setFilterOpen] = useState(false);

    const cutoffDate = new Date(Date.now() - filterDays * 24 * 60 * 60 * 1000);
    const filteredLogs = logs.filter((log) => new Date(log.createdAt) >= cutoffDate);
    const currentFilter = FILTER_OPTIONS.find((o) => o.value === filterDays) || FILTER_OPTIONS[1];

    return (
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center border border-violet-100">
                        <Activity className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Access Log</h2>
                        <p className="text-sm font-medium text-slate-500">
                            {isEnterprise ? 'Full history available' : 'Last 30 days'}
                        </p>
                    </div>
                </div>

                {/* Filter dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                        {currentFilter.label}
                        <ChevronDown className={`w-3 h-3 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {filterOpen && (
                        <>
                            <div className="fixed inset-0 z-20" onClick={() => setFilterOpen(false)} />
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {FILTER_OPTIONS.map((opt) => {
                                    // Non-Enterprise can't access Full History
                                    const disabled = !isEnterprise && opt.value === 365;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => {
                                                if (!disabled) {
                                                    setFilterDays(opt.value);
                                                    setFilterOpen(false);
                                                }
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${filterDays === opt.value
                                                    ? 'bg-blue-50 text-[#1e3a8a]'
                                                    : disabled
                                                        ? 'text-slate-300 cursor-not-allowed'
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            {opt.label}
                                            {disabled && ' 🔒'}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="p-8">
                {filteredLogs.length === 0 ? (
                    <div className="text-center py-8">
                        <Activity className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-medium">No activity yet</p>
                        <p className="text-xs text-slate-400 mt-1">Activity will appear here when team members interact with your case.</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />

                        <div className="space-y-6">
                            {filteredLogs.map((log) => {
                                const config = ACTION_CONFIG[log.actionType] || ACTION_CONFIG.viewed_page;
                                const Icon = config.icon;

                                return (
                                    <div key={log.id} className="flex items-start gap-4 relative">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 border border-white shadow-sm ${config.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1">
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {getActionDescription(log)}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
