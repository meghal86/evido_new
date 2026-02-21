'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { syncStripeStatus } from "@/app/actions/payment";

export function PaymentSuccessMessage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasSynced = useRef(false);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (sessionId && !hasSynced.current) {
            hasSynced.current = true;

            toast.promise(
                syncStripeStatus(sessionId),
                {
                    loading: 'Verifying payment...',
                    success: (data) => {
                        if (data.success) {
                            // Clear params and refresh to update plan in sidebar
                            const newParams = new URLSearchParams(searchParams.toString());
                            newParams.delete('payment_status');
                            newParams.delete('session_id');
                            router.replace(`/?${newParams.toString()}`);
                            router.refresh();
                            return `Success! Upgraded to ${data.plan} Plan.`;
                        } else {
                            return `Payment verified but sync failed: ${data.error}`;
                        }
                    },
                    error: 'Failed to verify payment'
                }
            );
        }
    }, [router, searchParams]);

    return null;
}
