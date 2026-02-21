
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        // Test the exact query from getProfileData
        const userId = "cmlm12gcv0000btsljyop6kgt" // The ID we found
        console.log('Fetching full profile for:', userId)

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { accounts: true, evidence: true }
        })

        if (user) {
            console.log('Successfully fetched user with relations!')
            console.log('Accounts:', user.accounts.length)
            console.log('Evidence:', user.evidence.length)
        } else {
            console.log('User not found with ID:', userId)
        }

    } catch (e) {
        console.error('Database query error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
