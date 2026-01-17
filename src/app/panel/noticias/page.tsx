import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { deleteArticle, toggleFeatured } from '@/app/actions/news-actions';
import { Eye, Pencil, Calendar, User, FileText, Plus, Star } from 'lucide-react';
import DeleteButton from '@/components/DeleteButton';
import AdminSearch from '@/components/AdminSearch';
import Pagination from '@/components/Pagination';
import { auth } from '@/auth'; // Necesario para verificar el rol

export const revalidate = 0;

export default async function NoticiasPanelPage(
    props: {
        searchParams?: Promise<{ q?: string; page?: string }>;
    }
) {
    // 1. VERIFICAR ROL
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    // 2. OBTENER PARÁMETROS
    const searchParams = await props.searchParams;
    const query = searchParams?.q || '';
    const currentPage = Number(searchParams?.page) || 1;
    const ITEMS_PER_PAGE = 10;

    // 3. FILTROS Y PAGINACIÓN
    const where = query ? { title: { contains: query, mode: 'insensitive' as const } } : {};
    const totalItems = await prisma.article.count({ where });
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const articles = await prisma.article.findMany({
        where,
        // Ordenar: Primero la destacada, luego las más nuevas
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
    });

    return (
        <div className="max-w-6xl mx-auto">

            {/* CABECERA */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Noticias</h1>
                        <p className="text-sm text-gray-500">Gestiona las publicaciones del portal</p>
                    </div>
                    <Link href="/panel/crear" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium shadow-sm">
                        <Plus size={20} /> Nueva Noticia
                    </Link>
                </div>
                {/* BUSCADOR */}
                <div className="w-full sm:max-w-md"><AdminSearch placeholder="Buscar por título..." /></div>
            </div>

            {/* --- VISTA ESCRITORIO (TABLA) --- */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="p-4 w-12 text-center"><Star size={16} /></th>
                            <th className="p-4 w-16">Img</th>
                            <th className="p-4">Título</th>
                            <th className="p-4 w-32">Sección</th>
                            <th className="p-4 w-40">Fecha</th>
                            <th className="p-4 w-32">Estado</th>
                            <th className="p-4 text-right w-32">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {articles.map((article) => (
                            <tr key={article.id} className={`hover:bg-gray-50 transition ${article.isFeatured ? 'bg-yellow-50/30' : ''}`}>

                                {/* BOTÓN DESTACAR (Cualquiera puede destacar, o puedes bloquearlo con isAdmin si prefieres) */}
                                <td className="p-4 text-center">
                                    <form action={toggleFeatured.bind(null, article.id)}>
                                        <button className={`p-1.5 rounded-full transition ${article.isFeatured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-100'}`}>
                                            <Star size={18} fill={article.isFeatured ? "currentColor" : "none"} />
                                        </button>
                                    </form>
                                </td>

                                <td className="p-4">
                                    <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 border">
                                        {article.mainImage ? <Image src={article.mainImage} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FileText size={16} /></div>}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <div className="font-medium text-gray-900 line-clamp-1" title={article.title}>{article.title}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><User size={10} /> {article.author || 'Redacción'}</div>
                                </td>

                                <td className="p-4"><span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200 font-medium">{article.section}</span></td>

                                <td className="p-4 text-sm text-gray-500 font-mono">{new Date(article.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>

                                <td className="p-4">
                                    {article.published ? <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Publicada</span> : <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Borrador</span>}
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/noticia/${article.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Eye size={18} /></Link>
                                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded opacity-50 cursor-not-allowed"><Pencil size={18} /></button>

                                        {/* BOTÓN BORRAR (BLOQUEADO SI NO ES ADMIN) */}
                                        <form action={deleteArticle.bind(null, article.id)}>
                                            <DeleteButton
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                disabled={!isAdmin} // <--- SE DESHABILITA
                                            />
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- VISTA MÓVIL (TARJETAS) --- */}
            <div className="md:hidden space-y-4">
                {articles.map((article) => (
                    <div key={article.id} className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col gap-3 relative ${article.isFeatured ? 'border-yellow-200 ring-1 ring-yellow-100' : 'border-gray-200'}`}>

                        <div className="absolute top-4 right-4 z-10">
                            <form action={toggleFeatured.bind(null, article.id)}>
                                <button className={`p-1.5 rounded-full shadow-sm border transition ${article.isFeatured ? 'text-yellow-500 bg-yellow-50 border-yellow-200' : 'text-gray-300 bg-white border-gray-100 hover:text-yellow-400'}`}>
                                    <Star size={16} fill={article.isFeatured ? "currentColor" : "none"} />
                                </button>
                            </form>
                        </div>

                        <div className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border shrink-0">
                                {article.mainImage ? <Image src={article.mainImage} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FileText size={20} /></div>}
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="inline-block bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border border-blue-100">{article.section}</span>
                                    {article.published ? <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></span> : <span className="w-2 h-2 rounded-full bg-gray-300"></span>}
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{article.title}</h3>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-b border-gray-50 py-2">
                            <div className="flex items-center gap-1"><User size={12} /><span className="truncate max-w-[100px]">{article.author || 'Redacción'}</span></div>
                            <div className="flex items-center gap-1"><Calendar size={12} /><time>{new Date(article.publishedAt).toLocaleDateString('es-ES')}</time></div>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            <Link href={`/noticia/${article.slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 border border-gray-200"><Eye size={14} /> Ver</Link>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-orange-50 text-orange-700 text-xs font-medium hover:bg-orange-100 border border-orange-200 opacity-50 cursor-not-allowed"><Pencil size={14} /> Editar</button>

                            <form action={deleteArticle.bind(null, article.id)} className="flex-1">
                                <DeleteButton
                                    className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 border border-red-200"
                                    iconSize={14}
                                    showText={true}
                                    disabled={!isAdmin} // <--- SE DESHABILITA
                                />
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {articles.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white rounded-lg border border-dashed mt-4">{query ? 'No se encontraron noticias.' : 'No hay noticias registradas.'}</div>
            ) : (
                <div className="mt-8"><Pagination totalPages={totalPages} /></div>
            )}
        </div>
    );
}