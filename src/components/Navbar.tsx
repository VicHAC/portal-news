'use client'; // <--- 1. Esto es vital para que funcionen los clicks

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const SECTIONS = [
    { name: 'Política', slug: 'politica' },
    { name: 'Deportes', slug: 'deportes' },
    { name: 'Tecnología', slug: 'tecnologia' },
    { name: 'Cultura', slug: 'cultura' },
    { name: 'Opinión', slug: 'opinion' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="font-extrabold text-2xl tracking-tighter text-gray-900 z-50">
                    MiPortal<span className="text-blue-600">.</span>
                </Link>

                {/* Menú Desktop (Se oculta en móvil "hidden md:flex") */}
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

                {/* Botones Derecha */}
                <div className="flex items-center gap-4 z-50">
                    {/* Botón Admin (Visible siempre o podrías ocultarlo en móvil si quieres) */}
                    <Link
                        href="/panel"
                        className="hidden sm:block text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Admin
                    </Link>

                    {/* Botón Hamburguesa (Solo móvil "md:hidden") */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-600 p-1 rounded hover:bg-gray-100 focus:outline-none"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
            {/* Solo se muestra si isOpen es true y estamos en móvil */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg flex flex-col p-4 animate-in slide-in-from-top-5">
                    {SECTIONS.map((sec) => (
                        <Link
                            key={sec.slug}
                            href={`/seccion/${sec.slug}`}
                            onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic
                            className="text-lg font-medium text-gray-700 py-3 border-b border-gray-100 last:border-0 hover:text-blue-600"
                        >
                            {sec.name}
                        </Link>
                    ))}

                    {/* Opción extra de Admin para móvil */}
                    <Link
                        href="/panel"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-bold text-gray-900 py-3 mt-2"
                    >
                        Panel Administrativo
                    </Link>
                </div>
            )}
        </nav>
    );
}