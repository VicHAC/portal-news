import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { deleteArticle } from '@/app/actions/news-actions';
import { Pencil, Trash2, Eye } from 'lucide-react';

export default async function GestionNoticiasPage() {
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
                            <th className="p-4 font-medium text-gray-500">Fecha</th>
                            <th className="p-4 font-medium text-gray-500 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50">
                                <td className="p-4 w-24">
                                    {article.mainImage ? (
                                        <Image
                                            src={article.mainImage}
                                            alt="Miniatura"
                                            width={60}
                                            height={40}
                                            className="rounded object-cover h-10 w-16"
                                        />
                                    ) : (
                                        <div className="w-16 h-10 bg-gray-200 rounded"></div>
                                    )}
                                </td>
                                <td className="p-4 max-w-xs truncate font-medium text-gray-900">
                                    {article.title}
                                </td>
                                <td className="p-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-bold">
                                        {article.section}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    {/* Ver */}
                                    <Link
                                        href={`/noticia/${article.slug}`}
                                        target="_blank"
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                        title="Ver noticia"
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

                                    {/* Borrar */}
                                    <form action={deleteArticle.bind(null, article.id)}>
                                        <button
                                            type="submit"
                                            className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {articles.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No hay noticias creadas aún.
                    </div>
                )}
            </div>
        </div>
    );
}