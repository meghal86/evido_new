'use client';

import React from 'react';

export const CitationImpactChart = () => {
    // Mock data for citation growth
    const data = [
        { year: '2021', citations: 12 },
        { year: '2022', citations: 45 },
        { year: '2023', citations: 128 },
        { year: '2024', citations: 350 },
        { year: '2025', citations: 890 },
    ];

    const max = Math.max(...data.map(d => d.citations));

    return (
        <div className="glass rounded-[2.5rem] p-8 mb-8 border border-slate-200/50">
            <h3 className="text-lg font-black text-[#0f172a] mb-6">Citation Trajectory</h3>

            <div className="flex items-end gap-4 h-48 w-full">
                {data.map((item) => (
                    <div key={item.year} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-slate-100 rounded-t-xl relative overflow-hidden h-full flex items-end">
                            <div
                                className="w-full bg-[#1e3a8a] hover:bg-blue-600 transition-all duration-1000 ease-out relative group-hover:premium-shadow"
                                style={{ height: `${(item.citations / max) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.citations} Citations
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{item.year}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs font-medium text-slate-500 bg-slate-50 p-4 rounded-xl">
                <span>Total Citations: <strong className="text-[#0f172a]">1,425</strong></span>
                <span>h-index: <strong className="text-[#0f172a]">18</strong></span>
                <span>i10-index: <strong className="text-[#0f172a]">24</strong></span>
            </div>
        </div>
    );
};
