import prisma from '@/lib/prisma';
import NewsCard from '@/components/NewsCard';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });
  const takeCount = config?.homeNewsCount || 10;

  const featuredArticle = await prisma.article.findFirst({
    where: { published: true, isFeatured: true },
  });

  const recentArticles = await prisma.article.findMany({
    where: {
      published: true,
      id: { not: featuredArticle?.id }
    },
    orderBy: { publishedAt: 'desc' },
    take: takeCount,
  });

  // Helper Autores
  const authorNames = new Set<string>();
  if (featuredArticle?.author) authorNames.add(featuredArticle.author);
  recentArticles.forEach(a => { if (a.author) authorNames.add(a.author); });

  const authors = await prisma.author.findMany({
    where: { name: { in: Array.from(authorNames) } },
    select: { name: true, image: true }
  });

  const authorImageMap = new Map<string, string | null>();
  authors.forEach(author => authorImageMap.set(author.name, author.image));
  const getAuthorImage = (articleAuthor: string | null) => articleAuthor ? authorImageMap.get(articleAuthor) : null;

  // Helper Colores
  const sections = await prisma.section.findMany();
  const sectionColorMap = new Map<string, string>();
  sections.forEach(sec => sectionColorMap.set(sec.slug, sec.color));
  const getSectionColor = (sectionSlug: string) => sectionColorMap.get(sectionSlug) || '#2563eb';

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8">

        {/* DESTACADA */}
        {featuredArticle && (
          <div className="mb-12">
            <Link href={`/noticia/${featuredArticle.slug}`} className="group relative block rounded-2xl overflow-hidden shadow-xl h-[400px] md:h-[500px]">
              {featuredArticle.mainImage ? (
                <Image src={featuredArticle.mainImage} alt={featuredArticle.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-slate-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3">
                <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-3 uppercase tracking-wider shadow-sm">
                  {featuredArticle.section}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 group-hover:text-blue-200 transition drop-shadow-sm">
                  {featuredArticle.title}
                </h1>

                {/* AUTOR EN DESTACADA (CONDICIONAL) */}
                {featuredArticle.author && (
                  <div className="flex items-center gap-3 text-white/90 text-sm font-medium mb-3">
                    {getAuthorImage(featuredArticle.author) && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white/30 shadow-sm">
                        <Image src={getAuthorImage(featuredArticle.author)!} alt={featuredArticle.author} fill className="object-cover" />
                      </div>
                    )}
                    <span className="drop-shadow-md">Por: {featuredArticle.author}</span>
                  </div>
                )}

                <p className="text-gray-200 line-clamp-2 md:line-clamp-3 text-lg drop-shadow-sm">
                  {featuredArticle.summary}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* LISTA */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">Recientes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              authorImage={getAuthorImage(article.author)}
              sectionColor={getSectionColor(article.section)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}