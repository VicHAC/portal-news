import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

// Definimos params como Promesa para Next.js 15
interface Props {
    params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
    const article = await prisma.article.findUnique({
        where: { slug },
    });
    if (!article) return null;
    return article;
}

// También hay que esperar params en generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params; // <--- AWAIT AQUÍ
    const article = await getArticle(slug);

    if (!article) return { title: 'Noticia no encontrada' };

    return {
        title: article.title,
        description: article.summary,
        openGraph: {
            title: article.title,
            description: article.summary || '',
            type: 'article',
            publishedTime: article.createdAt.toISOString(),
            authors: [article.author || 'Redacción'],
            images: article.mainImage ? [{ url: article.mainImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.summary || '',
            images: article.mainImage ? [article.mainImage] : [],
        },
    };
}

export default async function NoticiaPage({ params }: Props) {
    const { slug } = await params; // <--- AWAIT AQUÍ TAMBIÉN
    const article = await getArticle(slug);

    if (!article) notFound();

    return (
        <article className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-4">
                <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
                    ← Volver al inicio
                </Link>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-4">
                <header className="mb-8 text-center md:text-left">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold uppercase mb-4 tracking-wide">
                        {article.section}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                        {article.title}
                    </h1>
                    <div className="flex flex-col md:flex-row items-center md:justify-between text-gray-500 text-sm border-t border-b py-4">
                        <div className="font-medium text-gray-900">
                            Por: {article.author || 'Redacción'}
                        </div>
                        <time>{new Date(article.createdAt).toLocaleDateString('es-ES', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}</time>
                    </div>
                </header>

                {article.mainImage && (
                    <div className="relative w-full h-[300px] md:h-[500px] mb-10 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src={article.mainImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {article.content}
                </div>
            </div>
        </article>
    );
}