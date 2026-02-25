'use server';

import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(planName: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    let priceId;
    switch (planName) {
        case 'Basic':
            priceId = process.env.STRIPE_PRICE_BASIC;
            break;
        case 'Premium':
            priceId = process.env.STRIPE_PRICE_PREMIUM;
            break;
        case 'Enterprise':
            priceId = process.env.STRIPE_PRICE_ENTERPRISE;
            break;
        default:
            throw new Error("Invalid plan");
    }

    if (!priceId) {
        return {
            error: `Billing is not fully configured for the ${planName} plan yet. Missing Price ID.`,
            success: false
        };
    }

    // Enterprise is a recurring subscription; Basic/Premium are one-time payments
    const isSubscription = planName === 'Enterprise';

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: isSubscription ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/upgrade?payment_status=cancelled`,
            metadata: {
                userId: session.user.id,
                planName: planName
            },
            ...(isSubscription ? {} : { customer_email: session.user.email || undefined }),
            ...(isSubscription ? { customer_email: session.user.email || undefined, subscription_data: { metadata: { userId: session.user.id, planName } } } : {}),
        });

        if (!checkoutSession.url) {
            throw new Error("Failed to create checkout session");
        }

        return {
            url: checkoutSession.url,
            success: true
        };
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return {
            error: error.message,
            success: false
        };
    }
}
