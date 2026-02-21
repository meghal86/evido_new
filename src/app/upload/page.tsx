'use client';

import { Header } from '@/components/header';
import { FileUpload } from "@/components/upload/file-upload";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen lg:pl-64 bg-slate-50/50">
            <Header title="Upload Evidence" progress={30} />

            <div className="pt-32 lg:pt-28 pb-16 px-4 lg:px-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span>Back</span>
                </button>

                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Add Supporting Documents</h2>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                        Upload your awards, certificates, membership letters, or media articles.
                        AI will automatically extract key details and suggest the right criterion.
                    </p>
                </div>
                <FileUpload />
            </div>
        </div>
    );
}
