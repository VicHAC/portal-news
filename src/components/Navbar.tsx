import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import NavSearch from './NavSearch';
import MobileMenu from './MobileMenu';

export default async function Navbar() {
    // 1. Obtener Configuración y Secciones
    const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });
    const sections = await prisma.section.findMany({ orderBy: { order: 'asc' } });

    // Estilos comunes (Escritorio)
    const linkStyles = "px-3 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 uppercase tracking-wide transition-colors rounded-md hover:bg-gray-50";

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* A. LOGO */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 transition-opacity hover:opacity-80 pl-0 md:pl-8">
                        {config?.logoUrl ? (
                            <div className="relative w-48 h-12 md:w-48 md:h-14">
                                <Image
                                    src={config.logoUrl}
                                    alt="Logo"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                    sizes="(max-width: 768px) 256px, 256px"
                                />
                            </div>
                        ) : (
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                Horizonte<span className="text-blue-600">Noticias</span>
                            </span>
                        )}
                    </Link>

                    <div className="flex items-center gap-4 md:pr-8">
                        {/* B. NAVEGACIÓN (Escritorio - hidden en md) */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/" className={linkStyles}>
                                Inicio
                            </Link>
                            {sections.map((section) => (
                                <Link key={section.id} href={`/seccion/${section.slug}`} className={linkStyles}>
                                    {section.name}
                                </Link>
                            ))}
                        </nav>

                        {/* C. BOTONES */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <NavSearch />

                            {/* AQUÍ ESTÁ EL CAMBIO: Usamos el componente MobileMenu */}
                            {/* Le pasamos las secciones para que él las renderice en el móvil */}
                            <MobileMenu sections={sections} />
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}