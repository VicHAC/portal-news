'use client';

import { useActionState } from 'react'; // IMPORTANTE: Ahora viene de 'react', no de 'react-dom'
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/actions/auth-actions';
import { LockKeyhole, User } from 'lucide-react';

export default function LoginPage() {
    // useActionState reemplaza a useFormState en React 19
    // Devuelve: [estado, accion, estaPendiente]
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
                    <p className="text-gray-600 text-sm mt-2">Acceso exclusivo para personal autorizado</p>
                </div>

                <form action={dispatch} className="space-y-6">
                    {/* Campo Usuario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario
                        </label>
                        <div className="relative">
                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Ej: Administrador"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <LockKeyhole className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    {/* Mensaje de Error */}
                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    {/* Botón de Submit */}
                    <LoginButton />
                </form>
            </div>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            aria-disabled={pending}
            disabled={pending}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
        ${pending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
            {pending ? 'Ingresando...' : 'Entrar al Panel'}
        </button>
    );
}