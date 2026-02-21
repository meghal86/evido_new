'use client';

import React, { useState } from 'react';
import { X, User, Briefcase, Building, Mail, Users } from 'lucide-react';
import { addExpert } from '@/app/actions/letters';
import { toast } from 'sonner';

interface AddExpertModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddExpertModal: React.FC<AddExpertModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const data = {
            expertName: formData.get('expertName') as string,
            expertTitle: formData.get('expertTitle') as string,
            expertOrg: formData.get('expertOrg') as string,
            expertEmail: formData.get('expertEmail') as string,
            expertPhone: (formData.get('expertPhone') as string) || undefined,
            expertLinkedin: (formData.get('expertLinkedin') as string) || undefined,
            relationship: formData.get('relationship') as string,
            notes: (formData.get('notes') as string) || undefined
        };

        const result = await addExpert(data);

        setLoading(false);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Expert added successfully");
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-slate-400" />
                </button>

                <h2 className="text-2xl font-black text-[#0f172a] mb-6">Add Expert</h2>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Expert Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input
                                name="expertName"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all"
                                placeholder="Dr. Jane Doe"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input
                                    name="expertTitle"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all"
                                    placeholder="Senior Researcher"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Organization</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input
                                    name="expertOrg"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all"
                                    placeholder="Google DeepMind"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input
                                name="expertEmail"
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all"
                                placeholder="jane.doe@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone (Optional)</label>
                            <input
                                name="expertPhone"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">LinkedIn (Optional)</label>
                            <input
                                name="expertLinkedin"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all"
                                placeholder="linkedin.com/in/janedoe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Relationship</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <select
                                name="relationship"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all appearance-none"
                            >
                                <option value="independent">Independent Expert (Strongest)</option>
                                <option value="colleague">Colleague / Peer</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Notes (Optional)</label>
                        <textarea
                            name="notes"
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all resize-none"
                            placeholder="Details about how you know them..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-900 transition-all mt-4 flex justify-center"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Save Expert"}
                    </button>
                </form>
            </div>
        </div>
    );
};
