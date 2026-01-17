import prisma from '@/lib/prisma';
import NewsCard from '@/components/NewsCard';
import { Search } from 'lucide-react';
import Image from 'next/image'; // Importar Image por si se necesita en NewsCard o aquí

// Forzamos dinamismo para leer los searchParams en cada petición
export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function BuscarPage({ searchParams }: Props) {
    // Aquí sí leemos los parámetros
    const { q } = await searchParams;
    const query = q || '';

    // Búsqueda en BD
    const results = query ? await prisma.article.findMany({
        where: {
            published: true,
            title: { contains: query, mode: 'insensitive' }, // 'insensitive' ignora mayúsculas/minúsculas
        },
        orderBy: { publishedAt: 'desc' },
    }) : [];

    // Obtener colores y autores para las tarjetas (igual que en Home)
    const sections = await prisma.section.findMany();
    const sectionColorMap = new Map<string, string>();
    sections.forEach(sec => sectionColorMap.set(sec.slug, sec.color));
    const getSectionColor = (slug: string) => sectionColorMap.get(slug) || '#2563eb';

    // Helper simple para imagen de autor (puedes refinarlo como en el Home si quieres)
    const getAuthorImage = (authorName: string | null) => null; // Simplificado por ahora

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">

                {/* Cabecera */}
                <div className="mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Search className="text-blue-600" />
                        Resultados de búsqueda
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        {query ? (
                            <>Resultados para: <span className="font-bold text-gray-900">"{query}"</span></>
                        ) : (
                            "Escribe algo para buscar"
                        )}
                    </p>
                </div>

                {/* Lista de Resultados */}
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((article) => (
                            <NewsCard
                                key={article.id}
                                article={article}
                                sectionColor={getSectionColor(article.section)}
                                authorImage={null} // Opcional: implementar carga de autores aquí
                            />
                        ))}
                    </div>
                ) : (
                    // Estado Vacío
                    query && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="text-gray-300 mb-4 flex justify-center"><Search size={64} /></div>
                            <h3 className="text-xl font-bold text-gray-900">No encontramos nada</h3>
                            <p className="text-gray-500">Intenta con otras palabras clave.</p>
                        </div>
                    )
                )}
            </div>
        </main>
    );
}