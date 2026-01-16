import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // Protegemos todas las rutas excepto las estáticas y las de api
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};