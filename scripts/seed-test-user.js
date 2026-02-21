const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'test@evido.dev';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} already exists.`);
        // Update password just in case
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log(`Updated password for ${email}.`);
    } else {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Test User',
            },
        });
        console.log(`Created user ${email}.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
