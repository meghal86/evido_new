'use client'

import React, { useState } from 'react';
import { LayoutDashboard, FileText, Settings, LogOut, User, FileBarChart, Users, AlertTriangle, Upload, FolderOpen, X, Menu, CreditCard, Lock, Scale, MessageSquare, Briefcase, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { hasAccess } from '@/lib/plans';

interface SidebarProps {
    userPlan?: string;
    userRole?: string;
}

export function Sidebar({ userPlan = "Free", userRole = "petitioner" }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isAttorney = userRole === 'attorney';

    // Petitioner navigation
    const petitionerItems = [
        { id: '/', label: 'Dashboard', icon: LayoutDashboard, requiredPlan: 'Free' },
        { id: '/criteria', label: 'Criteria Tracking', icon: FileBarChart, requiredPlan: 'Free' },
        { id: '/letters', label: 'Expert Letters', icon: Users, requiredPlan: 'Premium' },
        { id: '/rfe', label: 'RFE Response', icon: AlertTriangle, requiredPlan: 'Basic' },
        { id: '/reports', label: 'Reports', icon: FileBarChart, requiredPlan: 'Basic' },
        { id: '/team', label: 'Team', icon: Users, requiredPlan: 'Premium' },
        { id: '/resources', label: 'Resources', icon: FileText, requiredPlan: 'Free' },
        { id: '/profile', label: 'Profile', icon: User, requiredPlan: 'Free' },
        { id: '/settings', label: 'Settings', icon: Settings, requiredPlan: 'Free' },
    ];

    // Attorney navigation
    const attorneyItems = [
        { id: '/attorney/cases', label: 'My Cases', icon: Briefcase, requiredPlan: 'Free' },
        { id: '/resources', label: 'Resources', icon: BookOpen, requiredPlan: 'Free' },
        { id: '/profile', label: 'Profile', icon: User, requiredPlan: 'Free' },
        { id: '/settings', label: 'Settings', icon: Settings, requiredPlan: 'Free' },
    ];

    const menuItems = isAttorney ? attorneyItems : petitionerItems;

    const handleNavigate = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    // Hide sidebar on landing and onboarding pages
    if (pathname === '/landing' || pathname?.startsWith('/onboarding') || pathname === '/login') return null;

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden h-16 bg-[#1e3a8a] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-2">
                    <FolderOpen className="w-6 h-6 text-[#f59e0b]" />
                    <span className="text-lg font-bold text-white tracking-tight">Evido</span>
                    {isAttorney && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md">ATT</span>
                    )}
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed left-0 top-0 bottom-0 w-64 bg-[#1e3a8a] text-white flex flex-col z-50 transition-transform duration-300 border-r border-white/10
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full bg-gradient-to-b from-[#1e3a8a] to-[#0f172a]">
                    <div className="p-8">
                        <div className="flex flex-col mb-12">
                            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleNavigate(isAttorney ? '/attorney/cases' : '/')}>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <FolderOpen className="w-6 h-6 text-[#1e3a8a]" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter">Evido</span>
                            </div>
                            <p className="text-[9px] text-blue-200/50 font-bold uppercase tracking-[0.2em] mt-3 leading-relaxed">
                                {isAttorney ? (
                                    <>Attorney<br />Case Management</>
                                ) : (
                                    <>Extraordinary Ability<br />Evidence Engine</>
                                )}
                            </p>
                        </div>

                        <nav className="space-y-1.5">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.id || (item.id !== '/' && pathname?.startsWith(item.id));
                                const isLocked = !hasAccess(userPlan, item.requiredPlan);

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => isLocked ? router.push('/upgrade') : handleNavigate(item.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 group active-click ${isActive
                                            ? 'bg-amber-400 text-[#1e3a8a] shadow-xl shadow-amber-500/20'
                                            : isLocked
                                                ? 'text-blue-300/30 hover:bg-white/5 cursor-not-allowed'
                                                : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#1e3a8a]' : isLocked ? 'text-blue-300/30' : 'text-blue-300/50 group-hover:text-blue-200'}`} />
                                            {item.label}
                                        </div>
                                        {isLocked && <Lock className="w-3.5 h-3.5 text-blue-300/30" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-auto p-6 space-y-6">
                        <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            {isAttorney ? (
                                /* Attorney bottom widget */
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Scale className="w-4 h-4 text-amber-400" />
                                        <p className="text-[11px] font-black text-amber-400 uppercase tracking-widest">Attorney Account</p>
                                    </div>
                                    <p className="text-[11px] text-blue-200/60 font-medium mb-4 leading-relaxed">Manage your clients and review their visa petitions.</p>
                                    <button
                                        onClick={() => handleNavigate('/profile')}
                                        className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-black rounded-xl border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        View Profile
                                    </button>
                                </>
                            ) : (
                                /* Petitioner bottom widget */
                                <>
                                    <p className="text-[11px] font-black text-amber-400 uppercase tracking-widest mb-1">{userPlan} Plan</p>
                                    {userPlan === 'Enterprise' ? (
                                        <>
                                            <p className="text-[11px] text-blue-200/60 font-medium mb-4 leading-relaxed">Full access to all features enabled.</p>
                                            <button
                                                onClick={() => handleNavigate('/settings')}
                                                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-black rounded-xl border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
                                            >
                                                <CreditCard className="w-3.5 h-3.5" />
                                                Manage Billing
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[11px] text-blue-200/60 font-medium mb-4 leading-relaxed">Unlock advanced AI analysis & reports.</p>
                                            <button
                                                onClick={() => handleNavigate('/upgrade')}
                                                className="w-full py-2.5 bg-white/10 hover:bg-amber-400 hover:text-[#1e3a8a] text-white text-[11px] font-black rounded-xl border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
                                            >
                                                <CreditCard className="w-3.5 h-3.5" />
                                                Upgrade Plan
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: '/landing' })}
                            className="w-full flex items-center gap-3 px-5 py-3 text-blue-200/40 text-xs font-bold hover:text-white transition-all duration-300 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                                <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                            </div>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
