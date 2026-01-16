import prisma from '@/lib/prisma';
import NewsCard from '@/components/NewsCard';
import { Article } from "@prisma/client";

// En Next.js 15, params es una Promesa
interface Props {
    params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function SeccionPage({ params }: Props) {
    // 1. ESPERAMOS la promesa para obtener el slug real
    const { slug } = await params;

    // 2. Ahora sí podemos usar .toLowerCase() sin miedo
    const articles = await prisma.article.findMany({
        where: {
            published: true,
            section: slug.toLowerCase(),
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-4xl font-bold text-gray-900 capitalize">
                    {slug}
                </h1>
                <p className="text-gray-500 mt-2">
                    Las últimas noticias sobre {slug}.
                </p>
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600">Aún no hay noticias en esta sección.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article: Article) => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
}