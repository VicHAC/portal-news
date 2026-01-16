import Link from 'next/link';
import { Menu } from 'lucide-react';

const SECTIONS = [
    { name: 'Política', slug: 'politica' },
    { name: 'Deportes', slug: 'deportes' },
    { name: 'Tecnología', slug: 'tecnologia' },
    { name: 'Cultura', slug: 'cultura' },
    { name: 'Opinión', slug: 'opinion' },
];

export default function Navbar() {
    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-extrabold text-2xl tracking-tighter text-gray-900">
                    MiPortal<span className="text-blue-600">.</span>
                </Link>

                {/* Menú Desktop */}
                <div className="hidden md:flex gap-6">
                    {SECTIONS.map((sec) => (
                        <Link
                            key={sec.slug}
                            href={`/seccion/${sec.slug}`}
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded transition"
                        >
                            {sec.name}
                        </Link>
                    ))}
                </div>

                {/* Botón Admin */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/panel"
                        className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Admin
                    </Link>
                    {/* Menú Móvil (Icono) */}
                    <button className="md:hidden text-gray-600">
                        <Menu />
                    </button>
                </div>
            </div>
        </nav>
    );
}