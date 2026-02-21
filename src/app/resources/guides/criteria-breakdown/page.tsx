
import { Header } from '@/components/header';
import { ArrowLeft, CheckCircle, Smartphone, Award, Users, BookOpen, Star, PenTool, Mic, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function CriteriaBreakdownGuide() {
    const criteria = [
        { id: "awards", icon: Award, title: "Awards & Prizes", desc: "Nationally or internationally recognized prizes or awards for excellence." },
        { id: "membership", icon: Users, title: "Membership", desc: "Membership in associations which require outstanding achievements." },
        { id: "published_material", icon: BookOpen, title: "Published Material", desc: "Material published about you in professional or major trade publications." },
        { id: "judging", icon: CheckCircle, title: "Judging", desc: "Participation as a judge of the work of others." },
        { id: "original", icon: Star, title: "Original Constributions", desc: "Original scientific, scholarly, artistic, athletic, or business-related contributions of major significance." },
        { id: "authorship", icon: PenTool, title: "Scholarly Authorship", desc: "Authorship of scholarly articles in the field." },
        { id: "leading", icon: Users, title: "Leading / Critical Role", desc: "Performance in a leading or critical role for distinguished organizations." },
        { id: "salary", icon: DollarSign, title: "High Salary", desc: "Commanding a high salary or other significantly high remuneration." },
    ];

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="Guide: 10 Criteria" />
            <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">

                <Link href="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1e3a8a] transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Library
                </Link>

                <h1 className="text-3xl font-black text-[#0f172a] mb-6">Understanding the 10 Criteria</h1>
                <div className="prose prose-slate max-w-none text-slate-600 mb-12">
                    <p className="text-lg leading-relaxed">
                        To qualify for the EB-1A visa, you must satisfy at least <strong>3 out of the 10 regulatory criteria</strong>.
                        Below is a breakdown of what USCIS is actually looking for in each category, beyond just the legal definition.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {criteria.map((c) => (
                        <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center mb-4 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                                <c.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2">{c.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                    <h3 className="text-xl font-black text-amber-900 mb-2">The "One-Two Step" Analysis</h3>
                    <p className="text-amber-800/80 leading-relaxed">
                        Remember: Satisfying 3 criteria is just step one. The officer will then perform a <strong>Final Merits Determination</strong> to decide if, looking at the evidence as a whole, you have sustained national or international acclaim. Don't just tick boxes; build a narrative.
                    </p>
                </div>

            </div>
        </div>
    );
}
