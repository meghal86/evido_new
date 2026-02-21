import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { email, password, name, role } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        // Validate role
        const validRole = role === 'attorney' ? 'attorney' : 'petitioner';

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "A user with this email already exists" },
                { status: 409 }
            )
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create the user with role
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                role: validRole,
                onboardingComplete: false,
            }
        })

        return NextResponse.json(
            { message: "Account created successfully", userId: user.id },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Registration error:", error?.message || error)
        return NextResponse.json(
            { error: error?.message || "Something went wrong" },
            { status: 500 }
        )
    }
}
