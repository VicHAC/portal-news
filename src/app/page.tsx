import prisma from '@/lib/prisma';
import NewsCard from '@/components/NewsCard';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  // 1. Obtener Configuración (cuántas noticias mostrar)
  const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });
  const takeCount = config?.homeNewsCount || 10;

  // 2. Obtener la Noticia Destacada
  const featuredArticle = await prisma.article.findFirst({
    where: { published: true, isFeatured: true },
  });

  // 3. Obtener el resto de noticias (excluyendo la destacada si existe)
  const recentArticles = await prisma.article.findMany({
    where: {
      published: true,
      id: { not: featuredArticle?.id } // Excluir la destacada para no repetirla
    },
    orderBy: { createdAt: 'desc' },
    take: takeCount,
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8">

        {/* --- SECCIÓN 1: NOTICIA DESTACADA --- */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-4 mb-6">
              Noticia del Día
            </h2>
            <Link href={`/noticia/${featuredArticle.slug}`} className="group relative block rounded-2xl overflow-hidden shadow-xl h-[400px] md:h-[500px]">
              {/* Imagen de Fondo Oscurecida */}
              {featuredArticle.mainImage ? (
                <Image
                  src={featuredArticle.mainImage}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Texto sobre la imagen */}
              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3">
                <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-3 uppercase tracking-wider">
                  {featuredArticle.section}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 group-hover:text-blue-200 transition">
                  {featuredArticle.title}
                </h1>
                <p className="text-gray-200 line-clamp-2 md:line-clamp-3 text-lg">
                  {featuredArticle.summary}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* --- SECCIÓN 2: ÚLTIMAS NOTICIAS --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">
            Recientes
          </h2>
        </div>

        {recentArticles.length === 0 && !featuredArticle ? (
          <div className="text-center py-20 text-gray-500">
            <p>No hay noticias publicadas todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}