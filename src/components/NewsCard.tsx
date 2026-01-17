import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

interface Article {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    mainImage: string | null;
    author: string | null;
    section: string;
    columnName?: string | null;
    createdAt: Date;
    publishedAt: Date;
}

interface NewsCardProps {
    article: Article;
    authorImage?: string | null;
    sectionColor?: string;
}

export default function NewsCard({ article, authorImage, sectionColor = '#2563eb' }: NewsCardProps) {

    const formattedDate = new Date(article.publishedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const hasImage = !!article.mainImage;

    return (
        <Link
            href={`/noticia/${article.slug}`}
            className={`group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col h-full
        ${!hasImage ? 'hover:border-gray-300' : ''}
      `}
        >
            {/* 1. IMAGEN */}
            {hasImage && (
                <div className="relative h-52 w-full bg-gray-200 overflow-hidden shrink-0">
                    <Image src={article.mainImage!} alt={article.title} fill className="object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute top-4 left-4">
                        <span className="inline-block text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm" style={{ backgroundColor: sectionColor }}>
                            {article.section}
                        </span>
                    </div>
                </div>
            )}

            {/* 2. CONTENIDO */}
            <div className={`p-6 flex flex-col flex-grow relative ${!hasImage ? 'pt-10 px-8' : ''}`}>

                {/* Decoración superior para notas sin foto */}
                {!hasImage && (
                    <div className="absolute top-0 left-0 w-full px-6 pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] px-3 py-1 bg-gray-50 rounded" style={{ color: sectionColor }}>
                                {article.section}
                            </span>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div className="w-full border-t border-gray-100 mt-1"></div>
                    </div>
                )}

                {/* Texto Central */}
                <div className={`flex flex-col ${!hasImage ? 'flex-grow justify-center py-2' : ''}`}>
                    {!hasImage && article.columnName && (
                        <h4 className="text-center text-blue-600 text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
                            — {article.columnName} —
                        </h4>
                    )}
                    <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition leading-tight ${!hasImage ? 'text-center text-2xl font-serif italic text-gray-800' : 'text-xl'}`}>
                        {article.title}
                    </h3>
                    {article.summary && (
                        <p className={`text-gray-600 text-sm mb-4 leading-relaxed ${!hasImage ? 'text-center line-clamp-5 font-serif text-gray-600 px-2' : 'line-clamp-3'}`}>
                            {article.summary}
                        </p>
                    )}
                </div>

                {!hasImage && <div className="w-full border-t-2 border-double border-gray-200 mb-4 mt-auto"></div>}

                {/* Footer: Autor y Fecha */}
                <div className={`flex items-center text-xs text-gray-500 w-full shrink-0 ${!hasImage ? 'justify-between' : 'justify-between border-t border-gray-50 pt-4 mt-auto'}`}>

                    {/* LÓGICA DE AUTOR: Solo se muestra si existe */}
                    {article.author ? (
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                            {authorImage ? (
                                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                    <Image src={authorImage} alt={article.author} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center border text-gray-400 shrink-0">
                                    <span className="text-xs font-bold">{article.author.charAt(0)}</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="truncate max-w-[120px] text-gray-900 font-semibold">{article.author}</span>
                                {hasImage && article.columnName && (
                                    <span className="text-[10px] text-blue-600 uppercase font-bold">{article.columnName}</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Div vacío para mantener el layout (fecha a la derecha)
                        <div></div>
                    )}

                    <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        <Calendar size={12} className="text-gray-400" />
                        <time className="font-mono">{formattedDate}</time>
                    </div>
                </div>
            </div>
        </Link>
    );
}