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
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [dirty, setDirty] = useState(false);

    const planLevel = { Free: 0, Basic: 1, Premium: 2, Enterprise: 3 }[userPlan] ?? 0;
    const isEnterprise = planLevel >= 3;
    const canAccess = planLevel >= 2;

    const handleToggle = (key: keyof Permissions) => {
        setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
        setSaved(false);
        setDirty(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updatePermissions(permissions);
            if (result.success) {
                toast.success('Permissions saved');
                setSaved(true);
                setDirty(false);
            } else {
                toast.error(result.error || 'Failed to save permissions');
            }
        } catch {
            toast.error('Failed to save permissions');
        } finally {
            setSaving(false);
        }
    };

    if (!canAccess) return null;

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

            <div className="p-8 space-y-1">
                {PERMISSION_ITEMS.map((item) => {
                    // Enterprise-only items are locked for non-Enterprise users
                    const isLocked = item.enterpriseOnly && !isEnterprise;
                    const checked = permissions[item.key];

                    return (
                        <div
                            key={item.key}
                            className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isLocked ? 'opacity-60' : 'hover:bg-slate-50 cursor-pointer'}`}
                            onClick={() => !isLocked && handleToggle(item.key)}
                        >
                            <div className="flex-1 min-w-0 mr-4">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-[#0f172a]">{item.label}</p>
                                    {isLocked && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg border border-amber-100">
                                            <Lock className="w-2.5 h-2.5" />
                                            Enterprise
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {item.description}
                                    {isLocked && ' · '}
                                    {isLocked && <a href="/upgrade" className="text-amber-600 font-bold hover:underline">Upgrade to unlock</a>}
                                </p>
                            </div>

                            {/* Toggle Switch */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isLocked) handleToggle(item.key);
                                }}
                                disabled={isLocked}
                                aria-label={`Toggle ${item.label}`}
                                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${isLocked ? 'bg-slate-200 cursor-not-allowed' :
                                        checked ? 'bg-emerald-500 cursor-pointer' : 'bg-slate-300 cursor-pointer'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="px-8 pb-8">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className={`w-full py-3 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${dirty
                            ? 'bg-[#1e3a8a] text-white hover:bg-[#162d6e] shadow-blue-900/10'
                            : saved
                                ? 'bg-emerald-500 text-white shadow-emerald-500/10'
                                : 'bg-slate-200 text-slate-500 shadow-none cursor-not-allowed'
                        }`}
                >
                    {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : saved ? (
                        <>
                            <Check className="w-4 h-4" />
                            Saved
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}
