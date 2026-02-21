'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { Prisma } from "@prisma/client"

export interface PetitionerOnboardingData {
    target_visa: string;
    field_of_work: string;
    case_stage: string;
    github_username?: string;
}

export interface AttorneyOnboardingData {
    firm_name: string;
    bar_number?: string;
    years_experience: string;
    specialization: string[];
    states_licensed: string[];
    professional_email?: string;
}

export async function savePetitionerOnboarding(data: PetitionerOnboardingData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                petitionerData: data as unknown as Prisma.InputJsonValue,
                onboardingComplete: true,
            }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Petitioner onboarding error:", error);
        return { error: "Failed to save onboarding data" };
    }
}

export async function saveAttorneyOnboarding(data: AttorneyOnboardingData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const attorneyJson: Record<string, unknown> = {
            bar_number: data.bar_number || null,
            firm_name: data.firm_name,
            states_licensed: data.states_licensed,
            specialization: data.specialization,
            years_experience: data.years_experience,
            is_verified: !!data.bar_number,
        };

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                attorneyData: attorneyJson as Prisma.InputJsonValue,
                onboardingComplete: true,
            }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Attorney onboarding error:", error);
        return { error: "Failed to save onboarding data" };
    }
}
