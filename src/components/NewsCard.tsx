import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';

// Definimos qué datos esperamos recibir
interface NewsCardProps {
    article: {
        slug: string;
        title: string;
        summary: string | null;
        mainImage: string | null;
        section: string;
        createdAt: Date;
        author: string | null;
    };
}

export default function NewsCard({ article }: NewsCardProps) {
    return (
        <Link
            href={`/noticia/${article.slug}`}
            className="group flex flex-col bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
        >
            {/* Contenedor de Imagen */}
            <div className="relative h-52 w-full bg-gray-200 overflow-hidden">
                <span className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs px-2 py-1 font-bold uppercase rounded shadow">
                    {article.section}
                </span>

                {article.mainImage ? (
                    <Image
                        src={article.mainImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Sin imagen
                    </div>
                )}
            </div>

            {/* Contenido Texto */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-xl mb-2 leading-tight group-hover:text-blue-700 transition">
                    {article.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {article.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t">
                    <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{article.author || 'Redacción'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <time>{article.createdAt.toLocaleDateString()}</time>
                    </div>
                </div>
            </div>
        </Link>
    );
}