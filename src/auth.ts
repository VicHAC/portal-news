import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { username, password } = credentials ?? {};

                if (!username || !password) return null;

                // 1. Buscar usuario en DB
                const user = await prisma.user.findUnique({
                    where: { username: String(username) },
                });

                if (!user) return null;

                // 2. Verificar contraseña
                const passwordsMatch = await compare(String(password), user.password);

                if (passwordsMatch) {
                    // Retornamos el usuario sin la contraseña
                    return {
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        username: user.username,
                    };
                }

                console.log('Contraseña incorrecta');
                return null;
            },
        }),
    ],
});