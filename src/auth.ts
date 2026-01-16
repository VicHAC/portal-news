import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    // --- NUEVA CONFIGURACIÓN DE SESIÓN ---
    session: {
        strategy: 'jwt',
        maxAge: 3600, // Tiempo en segundos (3600 = 1 hora). 
        // Si quieres que dure menos, pon 1800 (30 mins).
        // Al expirar este tiempo, pedirá login de nuevo.
    },
    // -------------------------------------
    providers: [
        Credentials({
            async authorize(credentials) {
                const { username, password } = credentials ?? {};

                if (!username || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { username: String(username) },
                });

                if (!user) return null;

                const passwordsMatch = await compare(String(password), user.password);

                if (passwordsMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        username: user.username,
                    };
                }
                return null;
            },
        }),
    ],
});