// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // 1. Encriptar contraseñas
    const passwordAdmin = await hash('Admin1234', 12);
    const passwordEditor = await hash('Editor1234', 12);

    // 2. Crear Admin (si no existe)
    const admin = await prisma.user.upsert({
        where: { username: 'Administrador' },
        update: {},
        create: {
            name: 'Super Admin',
            username: 'Administrador',
            password: passwordAdmin,
            role: 'ADMIN',
        },
    });

    // 3. Crear Editor (si no existe)
    const editor = await prisma.user.upsert({
        where: { username: 'Editor' },
        update: {},
        create: {
            name: 'Editor General',
            username: 'Editor',
            password: passwordEditor,
            role: 'EDITOR',
        },
    });

    console.log({ admin, editor });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });