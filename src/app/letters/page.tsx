import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { LettersDashboard } from "@/components/letters/letters-dashboard";

export default async function LettersPage() {
    const session = await auth();

    const letters = session?.user?.id ? await prisma.recommendationLetter.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    }) : [];

    return (
        <div className="min-h-screen lg:pl-64">
            <Header title="Expert Letters" progress={letters.length * 10} /> {/* Rough progress estimation */}
            <LettersDashboard letters={letters} />
        </div>
    );
}
