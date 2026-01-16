'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        // Convertimos el FormData a objeto y añadimos la redirección forzada
        const data = Object.fromEntries(formData);

        await signIn('credentials', {
            ...data,
            redirectTo: '/panel',
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales inválidas. Verifica tu usuario y contraseña.';
                default:
                    return 'Ocurrió un error inesperado.';
            }
        }
        // Es CRUCIAL relanzar el error para que la redirección funcione
        // (Next.js usa errores para manejar redirecciones)
        throw error;
    }
}