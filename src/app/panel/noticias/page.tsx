import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { deleteArticle, toggleFeatured } from '@/app/actions/news-actions'; // Importamos toggleFeatured
import { Pencil, Trash2, Eye, Star } from 'lucide-react';
import { auth } from '@/auth';

export const revalidate = 0; // Forzamos a que esta página no guarde caché y muestre cambios al instante

export default async function GestionNoticiasPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    // Obtenemos las noticias ordenadas por fecha (las nuevas primero)
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestionar Noticias</h1>
                <Link
                    href="/panel/crear"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    + Nueva Noticia
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Imagen</th>
                            <th className="p-4 font-medium text-gray-500">Título</th>
                            <th className="p-4 font-medium text-gray-500">Sección</th>
                            <th className="p-4 font-medium text-gray-500 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {articles.map((article) => (
                            <tr key={article.id} className={`hover:bg-gray-50 ${article.isFeatured ? 'bg-yellow-50/50' : ''}`}>

                                {/* 1. Imagen */}
                                <td className="p-4 w-24">
                                    {article.mainImage ? (
                                        <Image
                                            src={article.mainImage}
                                            alt="Miniatura"
                                            width={60}
                                            height={40}
                                            className="rounded object-cover h-10 w-16 border"
                                        />
                                    ) : (
                                        <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400 border">Sin img</div>
                                    )}
                                </td>

                                {/* 2. Título */}
                                <td className="p-4 max-w-xs truncate font-medium text-gray-900">
                                    {article.title}
                                    {article.isFeatured && (
                                        <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-300">
                                            Destacada
                                        </span>
                                    )}
                                </td>

                                {/* 3. Sección */}
                                <td className="p-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-bold">
                                        {article.section}
                                    </span>
                                </td>

                                {/* 4. Botones de Acción */}
                                <td className="p-4 text-right flex justify-end gap-2 items-center h-full">

                                    {/* Botón DESTACAR (Estrella) */}
                                    <form action={toggleFeatured.bind(null, article.id)}>
                                        <button
                                            type="submit"
                                            className={`p-2 rounded transition border ${article.isFeatured
                                                ? 'text-yellow-500 bg-yellow-100 border-yellow-200 hover:bg-yellow-200'
                                                : 'text-gray-400 border-transparent hover:text-yellow-500 hover:bg-gray-100'}`}
                                            title={article.isFeatured ? "Quitar destacado" : "Destacar noticia"}
                                        >
                                            <Star size={18} fill={article.isFeatured ? "currentColor" : "none"} />
                                        </button>
                                    </form>

                                    {/* Ver noticia real */}
                                    <Link
                                        href={`/noticia/${article.slug}`}
                                        target="_blank"
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100"
                                        title="Ver en la web"
                                    >
                                        <Eye size={18} />
                                    </Link>

                                    {/* Editar (Próximamente) */}
                                    <button
                                        disabled
                                        className="p-2 text-gray-300 cursor-not-allowed"
                                        title="Editar (Próximamente)"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    {/* Borrar (SOLO ADMIN) */}
                                    {isAdmin && (
                                        <form action={deleteArticle.bind(null, article.id)}>
                                            <button
                                                type="submit"
                                                className="p-2 text-red-500 hover:bg-red-50 rounded transition border border-transparent hover:border-red-100"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {articles.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-lg">No hay noticias creadas aún.</p>
                        <p className="text-sm mt-2">¡Crea la primera ahora mismo!</p>
                    </div>
                )}
            </div>
        </div>
    );
}