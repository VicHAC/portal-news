import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { Menu } from 'lucide-react';
import NavSearch from './NavSearch';

export default async function Navbar() {
    // 1. Obtener Configuración y Secciones
    const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });
    const sections = await prisma.section.findMany({ orderBy: { order: 'asc' } });

    // Estilos comunes para los enlaces (para no repetir tanto código)
    const linkStyles = "px-3 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 uppercase tracking-wide transition-colors rounded-md hover:bg-gray-50";

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* A. LOGO */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 transition-opacity hover:opacity-80">
                        {config?.logoUrl ? (
                            <div className="relative w-32 h-8 md:w-48 md:h-10">
                                <Image
                                    src={config.logoUrl}
                                    alt="Logo"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                    sizes="(max-width: 768px) 128px, 192px"
                                />
                            </div>
                        ) : (
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                Mi<span className="text-blue-600">Portal</span>
                            </span>
                        )}
                    </Link>

                    {/* B. NAVEGACIÓN (Escritorio) */}
                    <nav className="hidden md:flex items-center gap-1">

                        {/* 1. ENLACE DE INICIO (AGREGADO) */}
                        <Link href="/" className={linkStyles}>
                            Inicio
                        </Link>

                        {/* 2. SECCIONES DINÁMICAS */}
                        {sections.map((section) => (
                            <Link key={section.id} href={`/seccion/${section.slug}`} className={linkStyles}>
                                {section.name}
                            </Link>
                        ))}
                    </nav>

                    {/* C. BOTONES */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <NavSearch />

                        <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                            <Menu size={24} />
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}