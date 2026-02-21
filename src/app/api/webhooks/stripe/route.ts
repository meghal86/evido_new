import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
        // Fulfill the purchase...
        const userId = session.metadata?.userId;
        const planName = session.metadata?.planName; // 'Basic', 'Premium', etc.

        if (userId && planName) {
            console.log(`Processing successful payment for user ${userId}, plan: ${planName}`);
            await prisma.user.update({
                where: { id: userId },
                data: {
                    plan: planName,
                    // Store stripe customer ID if needed for future
                    stripeCustomerId: session.customer as string
                }
            });
        }
    }

    return NextResponse.json({ received: true });
}
