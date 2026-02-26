'use client';

import { Sparkles } from 'lucide-react';

export function AITip({ gap }: { gap?: { id: string, status: string } }) {
    const getTip = (id: string | undefined) => {
        switch (id) {
            case 'judging': return "Adding 2 judging activities (even local hackathons) could push your score effectively.";
            case 'published': return "Consider publishing on Medium or a company blog to start building your publication record.";
            case 'membership': return "Join 1-2 professional associations requiring 'outstanding achievements' to boost this criterion.";
            case 'awards': return "You haven't added any awards yet - consider industry recognition or company-wide accolades.";
            case 'authorship': return "Your authorship score is weak - remember to link any technical articles, papers, or patents you've authored.";
            case 'leading': return "Highlight your critical role in a distinguished organization. Did you lead any major technical initiatives?";
            case 'salary': return "Provide evidence that your compensation is significantly higher than others in similar roles in your region.";
            case 'artistic': return "While rare for engineers, any technical exhibitions or showcases of your work can count here.";
            case 'commercial': return "Have your contributions directly led to significant commercial success for your company? Document revenue metrics.";
            case 'original': return "Focus on documenting your original contributions - they are typically the strongest evidence type for engineers.";
            default: return "Focus on documenting your original contributions - they are the strongest evidence type.";
        }
    };

    return (
        <div className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#172554] rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 text-white mb-8">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="font-medium text-sm md:text-base">
                <span className="font-bold text-blue-200">AI Tip:</span> {getTip(gap?.id)}
            </span>
        </div>
    );
}
