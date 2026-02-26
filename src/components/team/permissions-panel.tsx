'use client';

import { useState } from 'react';
import { Shield, Lock, Save, Check } from 'lucide-react';
import { updatePermissions } from '@/app/actions/team';
import { toast } from 'sonner';

interface Permissions {
    view_case: boolean;
    download_evidence: boolean;
    email_notifications: boolean;
    edit_criteria: boolean;
    generate_reports: boolean;
}

interface PermissionsPanelProps {
    userPlan: string;
    initialPermissions: Permissions;
    hasMembers: boolean;
}

const PERMISSION_ITEMS = [
    {
        key: 'view_case' as const,
        label: 'View full case file',
        description: 'Team members can see all criteria, evidence, and reports',
        enterpriseOnly: false,
    },
    {
        key: 'download_evidence' as const,
        label: 'Download evidence documents',
        description: 'Allow downloading reports and evidence PDFs',
        enterpriseOnly: false,
    },
    {
        key: 'email_notifications' as const,
        label: 'Receive email notifications',
        description: 'Notify team when case is updated',
        enterpriseOnly: false,
    },
    {
        key: 'edit_criteria' as const,
        label: 'Edit criteria entries',
        description: 'Allow team members to add/edit evidence',
        enterpriseOnly: true,
    },
    {
        key: 'generate_reports' as const,
        label: 'Generate reports',
        description: 'Allow team to generate new evidence reports',
        enterpriseOnly: true,
    },
];

export function PermissionsPanel({ userPlan, initialPermissions, hasMembers }: PermissionsPanelProps) {
    const [permissions, setPermissions] = useState<Permissions>(initialPermissions);
    const [savingKey, setSavingKey] = useState<keyof Permissions | null>(null);

    const planLevel = { Free: 0, Basic: 1, Premium: 2, Enterprise: 3 }[userPlan] ?? 0;
    const isEnterprise = planLevel >= 3;
    const canAccess = planLevel >= 2;

    const handleToggle = async (key: keyof Permissions) => {
        const newValue = !permissions[key];
        const newPermissions = { ...permissions, [key]: newValue };
        setPermissions(newPermissions);

        setSavingKey(key);
        try {
            const result = await updatePermissions(newPermissions);
            if (result.success) {
                toast.success('Permissions auto-saved', {
                    position: 'bottom-right',
                    className: 'bg-emerald-50 text-emerald-800 border-emerald-200'
                });
            } else {
                toast.error(result.error || 'Failed to save permissions');
                setPermissions(permissions); // revert
            }
        } catch {
            toast.error('Failed to save permissions');
            setPermissions(permissions); // revert
        } finally {
            setSavingKey(null);
        }
    };

    if (!canAccess) return null;

    const defaultItems = PERMISSION_ITEMS.filter(item => !item.enterpriseOnly);
    const advancedItems = PERMISSION_ITEMS.filter(item => item.enterpriseOnly);

    return (
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Team Permissions</h2>
                    <p className="text-sm font-medium text-slate-500">Control what team members can access.</p>
                </div>
            </div>

            <div className="p-8 pb-4">
                <div className="mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-1">Default Team Permissions</h3>
                    <p className="text-xs font-medium text-slate-400">These permissions are automatically granted to all team members.</p>
                </div>

                <div className="space-y-1 bg-slate-50/50 rounded-2xl border border-slate-100 p-2">
                    {defaultItems.map((item) => {
                        const checked = permissions[item.key];
                        const isSaving = savingKey === item.key;

                        return (
                            <div
                                key={item.key}
                                className="flex items-center justify-between p-4 rounded-xl transition-colors hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 cursor-pointer group"
                                onClick={() => handleToggle(item.key)}
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-[#0f172a] group-hover:text-[#1e3a8a] transition-colors">{item.label}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleToggle(item.key); }}
                                    aria-label={`Toggle ${item.label}`}
                                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 flex items-center justify-center ${isSaving ? 'bg-slate-300 cursor-wait' :
                                            checked ? 'bg-emerald-500 cursor-pointer' : 'bg-slate-300 cursor-pointer'
                                        }`}
                                >
                                    {isSaving ? (
                                        <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="px-8 pb-8 pt-4">
                <div className="mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Advanced Permissions</h3>
                </div>

                <div className="space-y-1 bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl border border-amber-100/50 p-2 relative overflow-hidden">
                    {!isEnterprise && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    )}

                    {advancedItems.map((item) => {
                        const isLocked = !isEnterprise;
                        const checked = permissions[item.key];
                        const isSaving = savingKey === item.key;

                        return (
                            <div
                                key={item.key}
                                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isLocked ? 'opacity-60 grayscale-[0.5]' : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-amber-100/50 cursor-pointer group'}`}
                                onClick={() => !isLocked && handleToggle(item.key)}
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-bold ${isLocked ? 'text-slate-700' : 'text-[#0f172a] group-hover:text-amber-700 transition-colors'}`}>{item.label}</p>
                                        {isLocked && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-amber-600 text-[10px] font-bold rounded-lg border border-amber-200 uppercase tracking-widest">
                                                Enterprise
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {item.description}
                                        {isLocked && (
                                            <>
                                                <br />
                                                <a href="/upgrade" className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1 mt-1">
                                                    Upgrade to unlock <span className="text-[10px]">→</span>
                                                </a>
                                            </>
                                        )}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); if (!isLocked) handleToggle(item.key); }}
                                    disabled={isLocked || isSaving}
                                    aria-label={`Toggle ${item.label}`}
                                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 flex items-center justify-center ${isLocked ? 'bg-slate-200 cursor-not-allowed' :
                                            isSaving ? 'bg-slate-300 cursor-wait' :
                                                checked ? 'bg-amber-500 cursor-pointer' : 'bg-slate-300 cursor-pointer'
                                        }`}
                                >
                                    {isSaving ? (
                                        <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ${checked && !isLocked ? 'translate-x-5' : 'translate-x-0'}`} />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
