
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Evido <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to Evido',
            html: `<strong>Welcome, ${name}!</strong><p>Thank you for joining Evido. We're here to help you build your EB-1A case.</p>`,
        });

        if (error) {
            console.error(error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
};
