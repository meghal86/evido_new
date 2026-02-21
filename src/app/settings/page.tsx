import { auth, signOut } from "@/auth";
import { Header } from '@/components/header';
import { prisma } from "@/lib/prisma";
import {
    Shield, Lock, FileDown, Trash2,
    Github, Linkedin, ExternalLink, Check
} from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/landing');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { accounts: true }
    });

    const githubConnected = user?.accounts.some((a) => a.provider === 'github');
    const linkedinConnected = user?.accounts.some((a) => a.provider === 'linkedin'); // Assuming provider name

    return (
        <div className="min-h-screen lg:pl-64 bg-[#f8fafc]">
            <Header title="Settings & Security" progress={100} />

            <main className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-[1000px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* ═══════════════════════════════════════════════════════
                    SECURITY & COMPLIANCE - TRUST CENTER
                ═══════════════════════════════════════════════════════ */}
                <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                <Shield className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Data Nexus Security</h2>
                                <p className="text-sm font-medium text-slate-500">Your data is encrypted at rest and in transit.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest flex items-center gap-2">
                                <Lock className="w-3 h-3" /> AES-256 Encryption
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-white rounded-xl border border-slate-200/50 shadow-sm flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#0f172a]">Attorney-Client Privilege</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Data shared with invited attorneys is protected. Evido staff cannot access case files without explicit consent.
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-slate-200/50 shadow-sm flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                    <FileDown className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#0f172a]">Full Data Portability</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        You own your data. Export your entire case file, including evidence and generated reports, at any time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    CONNECTED ACCOUNTS
                ═══════════════════════════════════════════════════════ */}
                <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                    <h2 className="text-lg font-bold text-[#0f172a] mb-6">Connected Accounts</h2>
                    <div className="space-y-4">
                        {/* GitHub */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/50 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#24292e] flex items-center justify-center text-white">
                                    <Github className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#0f172a]">GitHub</h3>
                                    <p className="text-xs text-slate-500">
                                        {githubConnected ? "Connected for Evidence Sync" : "Not connected"}
                                    </p>
                                </div>
                            </div>
                            {githubConnected ? (
                                <button className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                                    Disconnect
                                </button>
                            ) : (
                                <button className="px-4 py-2 bg-[#0f172a] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors">
                                    Connect
                                </button>
                            )}
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/50 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0077b5] flex items-center justify-center text-white">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#0f172a]">LinkedIn</h3>
                                    <p className="text-xs text-slate-500">
                                        {linkedinConnected ? "Connected for Profile Data" : "Not connected"}
                                    </p>
                                </div>
                            </div>
                            {linkedinConnected ? (
                                <button className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                                    Disconnect
                                </button>
                            ) : (
                                <button className="px-4 py-2 bg-[#0077b5] text-white text-xs font-bold rounded-xl hover:bg-[#006396] transition-colors">
                                    Connect
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    DATA MANAGEMENT & DANGER ZONE
                ═══════════════════════════════════════════════════════ */}
                <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-[#0f172a]">Data Management</h2>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-[#0f172a]">Export Case File</h3>
                                <p className="text-xs text-slate-500 mt-1">Download all evidence, generated reports, and letters as a ZIP archive.</p>
                            </div>
                            <button className="px-5 py-2.5 bg-blue-50 text-[#1e3a8a] text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2">
                                <FileDown className="w-4 h-4" /> Export Data
                            </button>
                        </div>

                        <div className="pt-6 border-t border-slate-100/60">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-red-600">Delete Account</h3>
                                    <p className="text-xs text-slate-500 mt-1">Permanently remove all data. This action cannot be undone.</p>
                                </div>
                                <button className="px-5 py-2.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-100">
                                    <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center pb-8">
                    <form action={async () => {
                        'use server';
                        await signOut({ redirectTo: "/" });
                    }}>
                        <button className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>

            </main>
        </div>
    );
}
