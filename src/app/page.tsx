import prisma from '@/lib/prisma';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { Article } from "@prisma/client";

// Esta página se regenerará cada 60 segundos para mantenerla fresca pero rápida (ISR)
export const revalidate = 60;

export default async function HomePage() {
  // 1. Obtener las noticias más recientes desde la DB
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 9, // Traer las últimas 9
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Portada / Hero Section (La noticia más nueva destacada) */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">
            Últimas Noticias
          </h1>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No hay noticias publicadas todavía.</p>
            <p className="text-sm mt-2">Ve al panel para crear la primera.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}