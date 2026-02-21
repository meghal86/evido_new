'use client';

import { Activity, GitCommit, FileText, CheckCircle2 } from 'lucide-react';

export function RecentActivity({ activities }: { activities: any[] }) {
    // Mock activities for now until we have strict AuditLog fetching
    const items = activities.length > 0 ? activities : [
        { id: 1, type: 'signup', text: 'Joined Evido', date: 'Just now', icon: Activity, color: 'text-blue-500' },
        { id: 2, type: 'view', text: 'Viewed criteria dashboard', date: '2 mins ago', icon: Activity, color: 'text-slate-400' }
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-6 relative">
                <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800" />
                {items.map((item) => (
                    <div key={item.id} className="relative pl-12">
                        <div className="absolute left-3 top-1 w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center transform -translate-x-1/2">
                            <div className={`w-2 h-2 rounded-full ${item.type === 'signup' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{item.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
