import { auth } from "@/auth";
import { getUserRepos } from "@/lib/github";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Star, GitFork, ExternalLink } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable all caching

export default async function GitHubConnectPage() {
    const session = await auth();
    if (!session?.user?.id) return <div>Please log in to view repositories.</div>;

    // Prefer session token (fresh from login), fallback to DB
    // @ts-ignore
    const token = session.accessToken || (
        await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { accounts: true }
        })
    )?.accounts.find((a: any) => a.provider === 'github')?.access_token;

    if (!token) {
        return (
            <div className="min-h-screen p-8 lg:pl-72 pt-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">GitHub Not Connected</h1>
                    <Link href="/" className="text-blue-600 hover:underline">Return to Dashboard to Connect</Link>
                </div>
            </div>
        );
    }

    const repos = await getUserRepos(token, session.user.id);

    return (
        <div className="min-h-screen bg-gray-50 lg:pl-64">
            {/* Header */}
            <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <h1 className="text-lg lg:text-xl font-bold text-[#1e293b]">GitHub Repositories</h1>
                </div>
            </header>

            <div className="pt-24 pb-12 px-4 lg:px-8 max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-slate-800">Your Repositories</h2>
                        <span className="text-sm font-medium text-slate-500">{repos?.length || 0} found</span>
                    </div>

                    {repos?.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <p className="font-bold mb-2">No repositories found.</p>
                            <p className="text-sm">Ensure you have granted access to your repositories in GitHub.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4">Repository</th>
                                        <th className="px-6 py-4">Stats</th>
                                        <th className="px-6 py-4">Language</th>
                                        <th className="px-6 py-4">Criteria Category</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {repos.map((repo: any) => (
                                        <tr key={repo.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{repo.name}</div>
                                                <div className="text-xs text-slate-400 max-w-xs truncate">{repo.description || "No description"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1" title="Stars">
                                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                        <span className="font-bold text-slate-700">{repo.stars}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1" title="Forks">
                                                        <GitFork className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{repo.forks}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {repo.language ? (
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold">
                                                        {repo.language}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${repo.category === 'High Impact' ? 'bg-indigo-50 text-indigo-600' :
                                                    repo.category === 'Original Work' ? 'bg-emerald-50 text-emerald-600' :
                                                        'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {repo.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a
                                                    href={repo.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[#1e3a8a] transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
