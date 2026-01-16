import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) return { title: 'Noticia no encontrada' };

    return {
        title: article.title,
        description: article.summary,
        openGraph: {
            title: article.title,
            description: article.summary || '',
            images: article.mainImage ? [{ url: article.mainImage }] : [],
        },
    };
}

export default async function NoticiaPage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) notFound();

    return (
        <article className="min-h-screen bg-white">
            {/* Botón Volver */}
            <div className="container mx-auto px-4 py-4">
                <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
                    ← Volver al inicio
                </Link>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-4">
                {/* Cabecera */}
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
                            {article.columnName && (
                                <span className="ml-2 text-blue-600 font-bold"> | {article.columnName}</span>
                            )}
                        </div>
                        <time>{new Date(article.createdAt).toLocaleDateString('es-ES', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}</time>
                    </div>
                </header>

                {/* Imagen Principal */}
                {article.mainImage && (
                    <div className="mb-10">
                        <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src={article.mainImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* NUEVO: Crédito de Foto */}
                        {article.imageAuthor && (
                            <p className="text-right text-xs text-gray-500 mt-2 italic">
                                Foto: {article.imageAuthor}
                            </p>
                        )}
                    </div>
                )}

                {/* Contenido Texto */}
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap mb-12">
                    {article.content}
                </div>

                {/* NUEVO: Galería Collage */}
                {article.collage && article.collage.length > 0 && (
                    <div className="border-t pt-8 mt-8">
                        <h3 className="text-xl font-bold mb-6 text-gray-900 border-l-4 border-blue-600 pl-3">
                            Galería de Imágenes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {article.collage.map((imgUrl, index) => (
                                <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group">
                                    <Image
                                        src={imgUrl}
                                        alt={`Imagen galería ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}