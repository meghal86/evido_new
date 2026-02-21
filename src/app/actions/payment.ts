'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

export async function syncStripeStatus(sessionId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        if (!sessionId) return { success: false, error: "No session ID" };

        // 1. Retrieve the session from Stripe
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

        // 2. Verify payment status (works for both 'payment' and 'subscription' modes)
        if (checkoutSession.payment_status !== 'paid' && checkoutSession.status !== 'complete') {
            return { success: false, error: "Payment not completed" };
        }

        // 3. Determine plan from metadata (or look up price ID)
        const planName = checkoutSession.metadata?.planName;

        if (!planName) {
            return { success: false, error: "Unknown plan in metadata" };
        }

        // 4. Update User
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                plan: planName // 'Premium', 'Enterprise', etc.
            }
        });

        revalidatePath('/', 'layout');
        revalidatePath('/');
        return { success: true, plan: planName };
    } catch (error: any) {
        console.error("Sync Error:", error);
        return { success: false, error: error.message };
    }
}
