'use client';

import React from 'react';
import { FileText, Github, Linkedin, BookOpen, MoreVertical, CheckCircle2, AlertCircle, Clock, Lock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export interface EvidenceItemProps {
    id: string;
    exhibitId?: string | null;
    title: string;
    description?: string | null;
    sourceType?: string | null;
    sourceDate?: Date | null;
    metrics?: any;
    attorneyStatus: string;
    locked: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onRequestRevision?: () => void;
    isAttorney?: boolean;
    auditLogs?: any[];
}

export const EvidenceCard: React.FC<EvidenceItemProps> = ({
    id,
    exhibitId,
    title,
    description,
    sourceType,
    sourceDate,
    metrics,
    attorneyStatus,
    locked,
    isAttorney,
    onApprove,
    onReject,
    onRequestRevision,
    auditLogs
}) => {
    const getIcon = () => {
        switch (sourceType?.toLowerCase()) {
            case 'github': return <Github className="w-8 h-8 text-[#1e3a8a]" />;
            case 'linkedin': return <Linkedin className="w-8 h-8 text-[#0077b5]" />;
            case 'scholar': return <BookOpen className="w-8 h-8 text-[#4285f4]" />;
            default: return <FileText className="w-8 h-8 text-[#f43f5f]" />;
        }
    };

    const getStatusBadge = () => {
        switch (attorneyStatus) {
            case 'approved':
                return (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                        <AlertCircle className="w-3 h-3" />
                        Rejected
                    </div>
                );
            case 'revision_needed':
                return (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                        <AlertTriangle className="w-3 h-3" />
                        Revision
                    </div>
                );
            case 'under_review':
                return (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        <Clock className="w-3 h-3" />
                        Reviewing
                    </div>
                );
            default: // draft
                return (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                        Draft
                    </div>
                );
        }
    };

    return (
        <div className={`bg-white p-4 lg:p-5 rounded-3xl border transition-all flex flex-col md:flex-row gap-4 group hover:shadow-xl ${locked ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'
            }`}>
            {/* Exhibit ID Badge */}
            <div className="flex-shrink-0 flex md:flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#f8fafc] rounded-2xl flex items-center justify-center flex-shrink-0 relative">
                    {getIcon()}
                    {locked && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                            <Lock className="w-3 h-3" />
                        </div>
                    )}
                </div>
                {exhibitId && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        {exhibitId}
                    </span>
                )}
            </div>

            <div className="flex-grow min-w-0 flex flex-col justify-center gap-1">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h4 className="font-black text-[#1e293b] text-base truncate pr-2">{title}</h4>
                        <p className="text-xs text-[#64748b] font-medium truncate">{description || 'No description provided'}</p>
                    </div>
                    {getStatusBadge()}
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                        {sourceType || 'Manual Upload'}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="text-[10px] font-bold text-slate-400">
                        {sourceDate ? format(new Date(sourceDate), 'MMM d, yyyy') : 'Date not set'}
                    </div>
                    {metrics && Object.entries(metrics).map(([key, value]) => (
                        <React.Fragment key={key}>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                                {String(value)} {key.replace(/_/g, ' ')}
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {/* Attorney Actions */}
                {isAttorney && !locked && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                        <button onClick={onApprove} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors">
                            Approve
                        </button>
                        <button onClick={onRequestRevision} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors">
                            Request Revision
                        </button>
                        <button onClick={onReject} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
                            Reject
                        </button>
                    </div>
                )}
            </div>

            {/* Audit Trail */}
            {auditLogs && auditLogs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100/50">
                    <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Audit Trail
                    </h5>
                    <div className="space-y-3 pl-1">
                        {auditLogs.map((log: any) => (
                            <div key={log.id} className="relative pl-4 border-l-2 border-slate-100">
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-200 border-2 border-white" />
                                <div className="text-xs text-slate-600">
                                    <span className="font-bold text-[#1e3a8a]">{log.actorName}</span>{' '}
                                    <span className="font-medium">{log.action.replace('_', ' ')}</span> this item.
                                </div>
                                {log.notes && (
                                    <p className="text-[11px] text-slate-400 italic mt-0.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100/50 inline-block">
                                        "{log.notes}"
                                    </p>
                                )}
                                <div className="text-[10px] text-slate-300 font-bold mt-1">
                                    {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button className="p-2 text-slate-300 hover:text-slate-500 h-fit self-start md:self-center">
                <MoreVertical className="w-5 h-5" />
            </button>
        </div>
    );
};
