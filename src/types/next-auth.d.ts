// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Extendemos la interfaz User (la que viene de la DB)
     */
    interface User {
        role: string
    }

    /**
     * Extendemos la interfaz Session (la que usas en el front con session.user)
     */
    interface Session {
        user: {
            role: string
            id: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    /**
     * Extendemos el token JWT para que también guarde el rol
     */
    interface JWT {
        role: string
        id: string
    }
}