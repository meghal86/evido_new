'use client';

import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Gap {
    id: string;
    count: number;
    status: string;
}

const CRITERIA_NAMES: Record<string, string> = {
    'awards': 'Awards',
    'membership': 'Membership',
    'published': 'Published Material',
    'judging': 'Judging',
    'original': 'Original Contributions',
    'authorship': 'Authorship',
    'leading': 'Leading Role',
    'salary': 'High Salary',
    'artistic': 'Artistic Exhibitions',
    'commercial': 'Commercial Success'
};

export function TopGaps({ gaps }: { gaps: Gap[] }) {
    return (
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-orange-200 to-red-200" />

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Top 3 Gaps to Initializing
            </h3>

            <div className="grid gap-4">
                {gaps.length === 0 ? (
                    <div className="p-4 bg-emerald-50 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">All criteria look strong!</span>
                    </div>
                ) : (
                    gaps.slice(0, 3).map((gap) => (
                        <div key={gap.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-12 rounded-full ${gap.status === 'Weak' ? 'bg-red-400' : 'bg-amber-400'}`} />
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{CRITERIA_NAMES[gap.id] || gap.id}</h4>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">{gap.status} Coverage</p>
                                </div>
                            </div>
                            <Link
                                href={`/criteria/${gap.id}`}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
