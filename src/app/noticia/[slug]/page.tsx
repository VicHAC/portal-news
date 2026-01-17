import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import ImageCarousel from '@/components/ImageCarousel';

interface Props {
    params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
    const article = await prisma.article.findUnique({ where: { slug } });
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

    const sectionData = await prisma.section.findUnique({ where: { slug: article.section } });
    const badgeColor = article.isFeatured ? '#dc2626' : (sectionData?.color || '#2563eb');
    const sectionName = sectionData?.name || article.section;

    let authorImage = null;
    if (article.author) {
        const authorData = await prisma.author.findFirst({ where: { name: article.author }, select: { image: true } });
        authorImage = authorData?.image;
    }

    return (
        <article className="min-h-screen bg-white pt-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* CABECERA */}
                <header className="mb-8 text-center md:text-left">
                    <Link href={`/seccion/${article.section}`}>
                        <span className="inline-block text-white px-3 py-1 rounded-full text-sm font-bold uppercase mb-4 tracking-wide shadow-sm hover:opacity-90 transition" style={{ backgroundColor: badgeColor }}>
                            {sectionName}
                        </span>
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{article.title}</h1>

                    {/* DATOS DE PUBLICACIÓN */}
                    <div className="flex flex-col md:flex-row items-center md:justify-between text-gray-500 text-sm border-t border-b py-4 mt-6">

                        {/* LÓGICA DE AUTOR CONDICIONAL */}
                        <div className="flex items-center gap-3 font-medium text-gray-900">
                            {article.author ? (
                                <>
                                    {authorImage && (
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                                            <Image src={authorImage} alt={article.author} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="flex flex-col text-left">
                                        <span className="text-gray-900 font-bold text-base leading-none">
                                            Por: {article.author}
                                        </span>
                                        {article.columnName && (
                                            <span className="text-blue-600 text-xs font-bold uppercase mt-1 tracking-wide">{article.columnName}</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Si no hay autor, pero hay columna, mostrar solo la columna (opcional) o nada */
                                article.columnName && (
                                    <span className="text-blue-600 font-bold uppercase tracking-wide">{article.columnName}</span>
                                )
                            )}
                        </div>

                        <time className="mt-4 md:mt-0 bg-gray-50 px-3 py-1 rounded-md text-gray-600 border border-gray-100 font-mono text-xs">
                            {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </time>
                    </div>
                </header>

                {article.mainImage && (
                    <div className="mb-10">
                        <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg bg-gray-100">
                            <Image src={article.mainImage} alt={article.title} fill className="object-cover" priority />
                        </div>
                        {article.imageAuthor && <p className="text-right text-xs text-gray-500 mt-2 italic">Foto: {article.imageAuthor}</p>}
                    </div>
                )}

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap mb-12 font-serif">
                    {article.content}
                </div>

                {article.collage && article.collage.length > 0 && (
                    <ImageCarousel images={article.collage} />
                )}
            </div>
        </article>
    );
}