'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RoleSelector } from '@/components/role-selector';

export const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'petitioner' | 'attorney'>('petitioner');
    const router = useRouter();

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        setIsLoading(true);
        try {
            // Pass role as a query param — will be picked up after OAuth callback
            await signIn(provider, {
                callbackUrl: isLogin ? '/' : `/onboarding/${selectedRole}?role=${selectedRole}`,
            });
        } catch (error) {
            toast.error("Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (isLogin) {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid credentials.");
                setIsLoading(false);
            } else {
                toast.success("Welcome back!");
                router.push('/');
            }
        } else {
            // Signup: create account with role, then auto-sign-in
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, role: selectedRole }),
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.error || "Signup failed.");
                    setIsLoading(false);
                    return;
                }

                // Auto sign-in after successful registration
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    toast.error("Account created but auto-login failed. Please sign in.");
                    setIsLogin(true);
                } else {
                    toast.success("Account created! Welcome to Evido.");
                    router.push(`/onboarding/${selectedRole}`);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                {/* Header Toggle */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${isLogin ? 'bg-white text-[#1e293b]' : 'bg-slate-50 text-slate-400'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${!isLogin ? 'bg-white text-[#1e293b]' : 'bg-slate-50 text-slate-400'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-black text-[#1e293b] mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {isLogin ? 'Enter your details to access your case file.' : 'Choose your role to get started.'}
                        </p>
                    </div>

                    {/* Role selector — only in signup mode */}
                    {!isLogin && (
                        <RoleSelector selected={selectedRole} onSelect={setSelectedRole} />
                    )}

                    {/* Social Login */}
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 relative group"
                            onClick={() => handleSocialLogin('github')}
                            disabled={isLoading}
                        >
                            <Github className="w-5 h-5 mr-2 absolute left-4 text-slate-700" />
                            <span className="font-bold text-slate-700">Continue with GitHub</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 relative group"
                            onClick={() => handleSocialLogin('google')}
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5 mr-2 absolute left-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="font-bold text-slate-700">Continue with Google</span>
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                {isLogin && (
                                    <a href="#" className="text-xs font-bold text-[#1e3a8a] hover:underline">Forgot password?</a>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <Input id="password" name="password" type="password" className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors" required />
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-xl bg-[#1e293b] hover:bg-black text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    {isLogin ? 'Sign In' : `Create ${selectedRole === 'attorney' ? 'Attorney' : 'Petitioner'} Account`}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-slate-400 font-medium">
                        By continuing, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};
