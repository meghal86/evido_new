'use server'

import { auth } from "@/auth"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

export async function createCheckoutSession(priceId: string) {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    const email = session.user.email
    if (!email) throw new Error("Unauthorized")

    const userId = session.user.id
    if (!userId) throw new Error("Unauthorized")

    const checkoutSession = await stripe.checkout.sessions.create({
        customer_email: email,
        mode: 'payment', // or subscription
        line_items: [
            {
                price: priceId, // e.g., 'price_...'
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reports?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/upgrade?canceled=true`,
        metadata: {
            userId: userId
        }
    });

    if (checkoutSession.url) {
        redirect(checkoutSession.url);
    }
}
