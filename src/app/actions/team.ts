'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PLAN_LEVELS } from "@/lib/plans";

// ─── Helpers ───────────────────────────────────────────────────────
function getPlanLevel(plan: string | null | undefined): number {
    return PLAN_LEVELS[plan || 'Free'] ?? 0;
}

function canAccessTeam(plan: string): boolean {
    return getPlanLevel(plan) >= PLAN_LEVELS['Premium'];
}

function getMaxMembers(plan: string): number {
    if (getPlanLevel(plan) >= PLAN_LEVELS['Enterprise']) return Infinity;
    if (getPlanLevel(plan) >= PLAN_LEVELS['Premium']) return 1;
    return 0;
}

// ─── Get Team Members ─────────────────────────────────────────────
export async function getTeamMembers() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized", members: [] };

    try {
        const members = await prisma.teamMember.findMany({
            where: { caseOwnerId: session.user.id, status: { not: 'inactive' } },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, members };
    } catch (error: any) {
        console.error("getTeamMembers error:", error);
        return { success: false, error: error.message, members: [] };
    }
}

// ─── Invite Team Member ──────────────────────────────────────────
export async function inviteTeamMember(data: {
    email: string;
    role: string;
    message?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Check plan access
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { plan: true, name: true },
        });

        if (!canAccessTeam(user?.plan || 'Free')) {
            return { success: false, error: "Upgrade to Premium or Enterprise to invite team members" };
        }

        // Check member limit
        const currentCount = await prisma.teamMember.count({
            where: { caseOwnerId: session.user.id, status: { not: 'inactive' } },
        });
        const maxMembers = getMaxMembers(user?.plan || 'Free');
        if (currentCount >= maxMembers) {
            return {
                success: false,
                error: maxMembers === 1
                    ? "Premium plan allows 1 team member. Upgrade to Enterprise for unlimited."
                    : "Team member limit reached."
            };
        }

        // Create team member
        const member = await prisma.teamMember.create({
            data: {
                caseOwnerId: session.user.id,
                invitedEmail: data.email.toLowerCase().trim(),
                role: data.role,
                personalMessage: data.message || null,
                status: 'invited',
            },
        });

        // Log activity
        await prisma.teamActivityLog.create({
            data: {
                caseOwnerId: session.user.id,
                teamMemberId: member.id,
                actorName: user?.name || 'You',
                actionType: 'invited',
                actionDetails: { email: data.email, role: data.role },
            },
        });

        revalidatePath('/team');
        return { success: true, member };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "This email has already been invited to your team." };
        }
        console.error("inviteTeamMember error:", error);
        return { success: false, error: error.message };
    }
}

// ─── Remove Team Member ──────────────────────────────────────────
export async function removeTeamMember(memberId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const member = await prisma.teamMember.findFirst({
            where: { id: memberId, caseOwnerId: session.user.id },
        });
        if (!member) return { success: false, error: "Team member not found" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { name: true },
        });

        await prisma.teamMember.update({
            where: { id: memberId },
            data: { status: 'inactive' },
        });

        await prisma.teamActivityLog.create({
            data: {
                caseOwnerId: session.user.id,
                teamMemberId: memberId,
                actorName: user?.name || 'You',
                actionType: 'member_removed',
                actionDetails: { email: member.invitedEmail, role: member.role },
            },
        });

        revalidatePath('/team');
        return { success: true };
    } catch (error: any) {
        console.error("removeTeamMember error:", error);
        return { success: false, error: error.message };
    }
}

// ─── Resend Invite ────────────────────────────────────────────────
export async function resendInvite(memberId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const member = await prisma.teamMember.findFirst({
            where: { id: memberId, caseOwnerId: session.user.id, status: 'invited' },
        });
        if (!member) return { success: false, error: "Invite not found" };

        await prisma.teamMember.update({
            where: { id: memberId },
            data: { invitedAt: new Date() },
        });

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { name: true },
        });

        await prisma.teamActivityLog.create({
            data: {
                caseOwnerId: session.user.id,
                teamMemberId: memberId,
                actorName: user?.name || 'You',
                actionType: 'invite_resent',
                actionDetails: { email: member.invitedEmail },
            },
        });

        revalidatePath('/team');
        return { success: true };
    } catch (error: any) {
        console.error("resendInvite error:", error);
        return { success: false, error: error.message };
    }
}

// ─── Update Permissions ──────────────────────────────────────────
export async function updatePermissions(permissions: {
    view_case: boolean;
    download_evidence: boolean;
    email_notifications: boolean;
    edit_criteria: boolean;
    generate_reports: boolean;
}) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { plan: true },
        });

        // Enterprise-only permissions
        const isEnterprise = getPlanLevel(user?.plan || 'Free') >= PLAN_LEVELS['Enterprise'];
        const sanitized = {
            view_case: permissions.view_case,
            download_evidence: permissions.download_evidence,
            email_notifications: permissions.email_notifications,
            edit_criteria: isEnterprise ? permissions.edit_criteria : false,
            generate_reports: isEnterprise ? permissions.generate_reports : false,
        };

        // Update all active members
        await prisma.teamMember.updateMany({
            where: { caseOwnerId: session.user.id, status: { not: 'inactive' } },
            data: { permissions: sanitized },
        });

        revalidatePath('/team');
        return { success: true };
    } catch (error: any) {
        console.error("updatePermissions error:", error);
        return { success: false, error: error.message };
    }
}

// ─── Get Activity Log ────────────────────────────────────────────
export async function getActivityLog(days?: number) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized", logs: [] };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { plan: true },
        });

        const isEnterprise = getPlanLevel(user?.plan || 'Free') >= PLAN_LEVELS['Enterprise'];
        const daysToFetch = days || (isEnterprise ? 365 : 30);

        const since = new Date();
        since.setDate(since.getDate() - daysToFetch);

        const logs = await prisma.teamActivityLog.findMany({
            where: {
                caseOwnerId: session.user.id,
                createdAt: { gte: since },
            },
            include: { teamMember: { select: { invitedEmail: true, role: true } } },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return { success: true, logs };
    } catch (error: any) {
        console.error("getActivityLog error:", error);
        return { success: false, error: error.message, logs: [] };
    }
}
