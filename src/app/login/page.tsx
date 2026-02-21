import { AuthForm } from "@/components/auth-form";
import { Zap } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* Left Side - Brand & Value Prop */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-[#1e3a8a] text-white">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                        <span className="font-black text-xl tracking-tight text-white">Evido</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg mb-12 lg:mb-0">
                    <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
                        Build your EB-1A case with confidence.
                    </h1>
                    <p className="text-lg text-blue-100 leading-relaxed font-medium mb-8">
                        Join 2,500+ extraordinary professionals using Evido to structure, verify, and strengthen their immigration journey.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-3xl font-black text-white mb-1">98%</div>
                            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Success Rate</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1">24/7</div>
                            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">AI Support</div>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="lg:w-1/2 p-4 lg:p-12 flex items-center justify-center">
                <AuthForm />
            </div>
        </div>
    );
}
