import prisma from '@/lib/prisma';
import NewsCard from '@/components/NewsCard';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const sectionData = await prisma.section.findUnique({
        where: { slug: slug.toLowerCase() },
        select: { name: true },
    });

    if (!sectionData) {
        return {
            title: 'Sección no encontrada | Horizonte Noticias',
        };
    }

    return {
        title: `Horizonte Noticias | ${sectionData.name}`,
    };
}

export default async function SeccionPage({ params }: Props) {
    const { slug } = await params;

    // 1. INFO SECCIÓN
    const sectionData = await prisma.section.findUnique({
        where: { slug: slug.toLowerCase() },
    });

    if (!sectionData) {
        notFound();
    }

    // 2. NOTICIAS
    const articles = await prisma.article.findMany({
        where: {
            published: true,
            section: slug.toLowerCase(),
        },
        orderBy: { publishedAt: 'desc' },
    });

    return (
        <main className="min-h-screen bg-gray-50">

            {/* CABECERA: Título con líneas de color */}
            <div className="max-w-6xl mx-auto px-4 pt-6 pb-6">
                <div className="flex items-center justify-center gap-4 md:gap-6">
                    {/* Línea Izquierda */}
                    <div
                        className="h-1 w-12 md:w-32 rounded-full opacity-80"
                        style={{ backgroundColor: sectionData.color }}
                    />

                    {/* Nombre Sección */}
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 capitalize tracking-tight text-center">
                        {sectionData.name}
                    </h1>

                    {/* Línea Derecha */}
                    <div
                        className="h-1 w-12 md:w-32 rounded-full opacity-80"
                        style={{ backgroundColor: sectionData.color }}
                    />
                </div>
            </div>

            {/* --- NUEVA LÍNEA SEPARADORA --- */}
            <div className="max-w-6xl mx-auto px-4 py-2 mb-8">
                <hr className="border-gray-300" />
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="max-w-6xl mx-auto px-4">
                {articles.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500">Aún no hay noticias en esta sección.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <NewsCard
                                key={article.id}
                                article={article}
                                sectionColor={sectionData.color}
                                hideSectionBadge={true} // <--- AQUÍ ACTIVAMOS LA OCULTACIÓN
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}