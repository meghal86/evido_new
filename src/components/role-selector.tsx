'use client';

import { UserCheck, Scale, Check } from 'lucide-react';

interface RoleSelectorProps {
    selected: 'petitioner' | 'attorney';
    onSelect: (role: 'petitioner' | 'attorney') => void;
}

const ROLES = [
    {
        id: 'petitioner' as const,
        icon: UserCheck,
        title: "I'm a Petitioner",
        subtitle: 'Building my EB-1A, O-1, or EB-2 NIW visa petition',
        bullets: [
            'Track my 10 EB-1A criteria',
            'Generate AI evidence reports',
            'Invite my attorney to collaborate',
        ],
        cta: 'Get Started as Petitioner',
        accent: {
            border: 'border-[#1e3a8a]',
            bg: 'bg-[#1e3a8a]',
            bgLight: 'bg-blue-50',
            text: 'text-[#1e3a8a]',
            dot: 'bg-blue-500',
            badge: 'bg-[#1e3a8a] text-white',
        },
    },
    {
        id: 'attorney' as const,
        icon: Scale,
        title: "I'm an Attorney",
        subtitle: 'Reviewing and managing client visa petitions',
        bullets: [
            'Manage multiple client cases',
            'Review and annotate evidence',
            'Generate attorney-ready reports',
        ],
        cta: 'Get Started as Attorney',
        accent: {
            border: 'border-amber-500',
            bg: 'bg-amber-500',
            bgLight: 'bg-amber-50',
            text: 'text-amber-600',
            dot: 'bg-amber-500',
            badge: 'bg-amber-500 text-white',
        },
    },
];

export function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {ROLES.map((role) => {
                const isSelected = selected === role.id;
                const Icon = role.icon;

                return (
                    <button
                        key={role.id}
                        type="button"
                        onClick={() => onSelect(role.id)}
                        className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-300 group ${isSelected
                                ? `${role.accent.border} bg-white shadow-lg shadow-slate-100`
                                : 'border-slate-100 bg-white/60 opacity-60 hover:opacity-90 hover:border-slate-200'
                            }`}
                    >
                        {/* Checkmark badge */}
                        {isSelected && (
                            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${role.accent.badge} flex items-center justify-center shadow-md`}>
                                <Check className="w-3.5 h-3.5" />
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl ${role.accent.bgLight} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${role.accent.text}`} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-[#0f172a] leading-tight">{role.title}</p>
                                <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{role.subtitle}</p>
                            </div>
                        </div>

                        <ul className="space-y-1.5 ml-1">
                            {role.bullets.map((b, i) => (
                                <li key={i} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                                    <span className={`w-1.5 h-1.5 rounded-full ${role.accent.dot} flex-shrink-0`} />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </button>
                );
            })}
        </div>
    );
}
