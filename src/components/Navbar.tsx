'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

// Definimos la interfaz de lo que vamos a recibir
interface NavbarProps {
    sections: { id: string; name: string; slug: string }[];
}

// Quitamos la constante SECTIONS hardcodeada y usamos props
export default function Navbar({ sections }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    if (pathname && pathname.startsWith('/panel')) {
        return null;
    }

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                <Link href="/" className="font-extrabold text-2xl tracking-tighter text-gray-900 z-50">
                    MiPortal<span className="text-blue-600">.</span>
                </Link>

                {/* SECCIONES DINÁMICAS DESKTOP */}
                <div className="hidden md:flex gap-6">
                    {sections.map((sec) => (
                        <Link
                            key={sec.id} // Usamos el ID real de la DB
                            href={`/seccion/${sec.slug}`}
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded transition capitalize"
                        >
                            {sec.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4 z-50">
                    <Link href="/panel" className="hidden sm:block text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                        Admin
                    </Link>

                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-600 p-1 rounded hover:bg-gray-100 focus:outline-none">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* SECCIONES DINÁMICAS MÓVIL */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg flex flex-col p-4 animate-in slide-in-from-top-5">
                    {sections.map((sec) => (
                        <Link
                            key={sec.id}
                            href={`/seccion/${sec.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-gray-700 py-3 border-b border-gray-100 last:border-0 hover:text-blue-600 capitalize"
                        >
                            {sec.name}
                        </Link>
                    ))}
                    <Link href="/panel" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-900 py-3 mt-2">
                        Panel Administrativo
                    </Link>
                </div>
            )}
        </nav>
    );
}