import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/iniciarsesion', // Si no está logueado, lo manda aquí
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnPanel = nextUrl.pathname.startsWith('/panel');

            if (isOnPanel) {
                if (isLoggedIn) return true;
                return false; // Redirige a /iniciarsesion
            }
            return true;
        },
        jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }: any) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
    providers: [], // Se configuran en auth.ts
} satisfies NextAuthConfig;