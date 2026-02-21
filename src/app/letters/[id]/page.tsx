import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { LetterEditor } from "@/components/letters/letter-editor";
import { notFound } from "next/navigation";

export default async function LetterDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return notFound();

    const letter = await prisma.recommendationLetter.findFirst({
        where: { id: id, userId: session.user.id }
    });

    if (!letter) return notFound();

    return (
        <div className="min-h-screen lg:pl-64 pb-20">
            <Header title={`Drafting: ${letter.expertName}`} progress={50} />
            <LetterEditor letter={letter} />
        </div>
    );
}
