import { auth } from "@/auth";
import { getReadinessScore } from "@/lib/readiness-server";
import { RFEClientPage } from "@/components/rfe/rfe-page-content";

export default async function RFEPage() {
    const session = await auth();
    const score = await getReadinessScore(session?.user?.id || '');

    return <RFEClientPage initialProgress={score} />;
}
