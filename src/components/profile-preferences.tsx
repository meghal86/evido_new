'use client';

import { useState } from 'react';
import { Bell, Shield, CreditCard, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface PreferenceItem {
    icon: React.ElementType;
    title: string;
    description: string;
    key: string;
}

const preferenceItems: PreferenceItem[] = [
    {
        icon: Bell,
        title: 'Email Notifications',
        description: 'Get updates when your report is ready or scores change',
        key: 'emailNotifications',
    },
    {
        icon: Shield,
        title: 'Profile Visibility',
        description: 'Allow your anonymized data to improve our scoring model',
        key: 'profileVisibility',
    },
    {
        icon: CreditCard,
        title: 'Auto-Renewal',
        description: 'Automatically renew premium reports on expiry',
        key: 'autoRenewal',
    },
];

export function ProfilePreferences() {
    const [prefs, setPrefs] = useState<Record<string, boolean>>({
        emailNotifications: true,
        profileVisibility: false,
        autoRenewal: false,
    });

    const toggle = (key: string) => {
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        toast.success('Preferences saved successfully.');
    };

    return (
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(30,58,138,0.05)]">
            <h2 className="text-lg font-bold text-[#0f172a] mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-[#1e3a8a]" />
                </div>
                Preferences
            </h2>

            <div className="space-y-2">
                {preferenceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.key} className="flex items-center justify-between gap-6 p-4 rounded-2xl hover:bg-white transition-all duration-300 group">
                            <div className="flex items-center gap-5 min-w-0">
                                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                                    <Icon className="w-5 h-5 text-[#64748b] group-hover:text-[#1e3a8a] transition-colors" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[15px] font-bold text-[#0f172a] group-hover:text-blue-900 transition-colors">{item.title}</div>
                                    <div className="text-sm text-[#94a3b8] mt-1 leading-relaxed">{item.description}</div>
                                </div>
                            </div>

                            {/* Toggle switch — Custom Premium Navy */}
                            <button
                                onClick={() => toggle(item.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500 ease-in-out flex-shrink-0 ${prefs[item.key] ? 'bg-[#1e3a8a] shadow-[0_0_15px_rgba(30,58,138,0.3)]' : 'bg-slate-200'
                                    }`}
                                role="switch"
                                aria-checked={prefs[item.key]}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-500 ease-in-out shadow-sm ${prefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Divider + Actions */}
            <div className="border-t border-slate-100/60 mt-8 pt-8 flex items-center justify-between">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-slate-100 text-[#1e3a8a] text-sm font-bold rounded-xl hover:bg-blue-50 hover:text-[#1e40af] transition-all duration-300 active:scale-95"
                >
                    Save Changes
                </button>
                <button className="text-sm font-bold text-red-400 hover:text-red-500 transition-all duration-300 underline-offset-4 hover:underline">
                    Delete Account
                </button>
            </div>
        </section>
    );
}
