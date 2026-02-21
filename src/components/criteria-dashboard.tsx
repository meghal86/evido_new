'use client';

import React from 'react';
import {
    Trophy, Users, Newspaper, Scale, Lightbulb,
    PenTool, Briefcase, DollarSign, Palette, TrendingUp,
    ChevronRight, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

const criteria = [
    { id: 'awards', name: 'Awards', icon: Trophy, status: 'Strong', count: '3 awards detected', color: 'emerald' },
    { id: 'membership', name: 'Membership', icon: Users, status: 'Medium', count: '2 memberships', color: 'amber' },
    { id: 'published', name: 'Published Material', icon: Newspaper, status: 'Good', count: '5 articles', color: 'blue' },
    { id: 'judging', name: 'Judging', icon: Scale, status: 'Weak', count: 'Add evidence', color: 'red' },
    { id: 'original', name: 'Original Contributions', icon: Lightbulb, status: 'Strong', count: 'Auto from GitHub', color: 'emerald' },
    { id: 'authorship', name: 'Authorship', icon: PenTool, status: 'Good', count: '3 papers', color: 'blue' },
    { id: 'leading', name: 'Leading Role', icon: Briefcase, status: 'Strong', count: 'Senior Manager', color: 'emerald' },
    { id: 'salary', name: 'High Salary', icon: DollarSign, status: 'Strong', count: 'Top 10%', color: 'emerald' },
    { id: 'artistic', name: 'Artistic Exhibitions', icon: Palette, status: 'N/A', count: 'Not applicable', color: 'slate' },
    { id: 'commercial', name: 'Commercial Success', icon: TrendingUp, status: 'Medium', count: '$50k revenue', color: 'amber' },
];

const chartData = [
    { name: 'Strong', value: 5, color: '#10b981' },
    { name: 'Good', value: 2, color: '#3b82f6' },
    { name: 'Medium', value: 2, color: '#f59e0b' },
    { name: 'Weak', value: 1, color: '#ef4444' },
];

import { SourceMapping } from './source-mapping';

// ... imports

interface CriteriaDashboardProps {
    onSelectCriterion?: (id: string) => void;
    repos?: any[];
}

const categories = [
    {
        name: 'Scholarly & Recognition',
        items: ['awards', 'authorship', 'judging', 'published']
    },
    {
        name: 'Professional Impact',
        items: ['original', 'leading', 'commercial']
    },
    {
        name: 'Peer & Institutional',
        items: ['membership', 'salary', 'artistic']
    }
];

export const CriteriaDashboard: React.FC<CriteriaDashboardProps> = ({ onSelectCriterion, repos = [] }) => {
    const router = useRouter();

    const handleSelectCriterion = (id: string) => {
        if (onSelectCriterion) {
            onSelectCriterion(id);
        } else {
            router.push(`/criteria/${id}`);
        }
    };

    return (
        <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Strength Center — Glass Card */}
            <div className="glass rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-12 hover:premium-shadow transition-all duration-700 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

                <div className="w-48 h-48 relative flex-shrink-0 group">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                                animationDuration={1500}
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <span className="text-4xl font-black text-[#0f172a] tracking-tighter">7/10</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Profile Strength</span>
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left relative z-10">
                    <div className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-4">
                        Analysis Complete
                    </div>
                    <h2 className="text-3xl font-black text-[#0f172a] mb-3 tracking-tight">Case Evaluation</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-lg">We've mapped your evidence against all 10 EB-1A criteria. You currently meet the minimum requirements for a strong filing.</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-6">
                        <LegendItem color="#10b981" label="5 Strong" />
                        <LegendItem color="#3b82f6" label="2 Good" />
                        <LegendItem color="#f59e0b" label="2 Medium" />
                    </div>
                </div>
            </div>

            {/* GitHub Source Mapping Visualization (P0 Feature) */}
            <SourceMapping repos={repos} />

            {/* Categorized Criteria */}
            <div className="space-y-12">
                {categories.map((cat) => (
                    <div key={cat.name} className="space-y-4">
                        <div className="flex items-center gap-4 px-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{cat.name}</h3>
                            <div className="flex-grow h-px bg-slate-200/50" />
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {cat.items.map((id) => {
                                const item = criteria.find(c => c.id === id);
                                if (!item) return null;
                                return (
                                    <CriterionItem
                                        key={item.id}
                                        item={item}
                                        onClick={() => handleSelectCriterion(item.id)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CriterionItem = ({ item, onClick }: { item: any; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="glass p-5 rounded-2xl flex items-center gap-5 hover:border-blue-200 hover:premium-shadow transition-all duration-300 group active-click text-left"
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
            item.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    item.color === 'red' ? 'bg-rose-50 text-rose-600' :
                        'bg-slate-50 text-slate-400'
            }`}>
            <item.icon className="w-6 h-6" />
        </div>

        <div className="flex-grow">
            <h4 className="font-bold text-[#0f172a] group-hover:text-blue-900 transition-colors">{item.name}</h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{item.count}</p>
        </div>

        <div className="flex items-center gap-6">
            <StatusBadge status={item.status} color={item.color} />
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
        </div>
    </button>
);

const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
);

const StatusBadge = ({ status, color }: { status: string, color: string }) => {
    const styles: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        red: 'bg-rose-50 text-rose-700 border-rose-100',
        slate: 'bg-slate-50 text-slate-600 border-slate-100',
    };

    const icons: Record<string, React.ReactNode> = {
        Strong: <CheckCircle2 className="w-3.5 h-3.5" />,
        Good: <CheckCircle2 className="w-3.5 h-3.5 opacity-60" />,
        Medium: <Clock className="w-3.5 h-3.5" />,
        Weak: <AlertCircle className="w-3.5 h-3.5" />,
        'N/A': null,
    };

    if (status === 'N/A') return null;

    return (
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${styles[color]}`}>
            {icons[status]}
            {status}
        </div>
    );
};
