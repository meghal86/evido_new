const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'test@evido.dev';
    await prisma.user.update({
        where: { email },
        data: { plan: 'Free' }
    });
    console.log(`Reset ${email} to Free plan.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
