'use server'

import { sendWelcomeEmail } from "@/lib/resend";

export async function sendEmailAction(email: string, name: string) {
    return await sendWelcomeEmail(email, name);
}
