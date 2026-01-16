import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Newspaper, CheckCircle } from 'lucide-react';

export default async function PanelPage() {
    const session = await auth();

    // 1. Obtener datos REALES de la base de datos
    // Promise.all permite hacer las dos consultas al mismo tiempo para que sea más rápido
    const [totalNoticias, noticiasPublicadas] = await Promise.all([
        prisma.article.count(), // Total de noticias creadas
        prisma.article.count({ where: { published: true } }), // Solo las publicadas
    ]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Control</h1>

            <div className="bg-white p-6 rounded-lg shadow border mb-8">
                <h2 className="text-xl font-semibold mb-2">Bienvenido, {session?.user?.name}</h2>
                <p className="text-gray-600">
                    Has ingresado como <span className="font-bold uppercase text-blue-600">{session?.user?.role}</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contador Total */}
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Total Noticias</p>
                        <p className="text-4xl font-bold text-gray-900">{totalNoticias}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <Newspaper size={32} />
                    </div>
                </div>

                {/* Contador Publicadas */}
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Publicadas en la web</p>
                        <p className="text-4xl font-bold text-gray-900">{noticiasPublicadas}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <CheckCircle size={32} />
                    </div>
                </div>
            </div>
        </div>
    );
}