'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    sections: { id: string; name: string; slug: string }[];
}

export default function Navbar({ sections }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Si estamos en el panel de administración, no mostramos este navbar
    if (pathname && pathname.startsWith('/panel')) {
        return null;
    }

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="font-extrabold text-2xl tracking-tighter text-gray-900 z-50">
                    MiPortal<span className="text-blue-600">.</span>
                </Link>

                {/* --- MENÚ DESKTOP --- */}
                <div className="hidden md:flex gap-6">

                    {/* 1. Botón INICIO (Fijo) */}
                    <Link
                        href="/"
                        className="text-sm font-bold text-gray-900 hover:text-blue-600 px-3 py-2 rounded transition"
                    >
                        Inicio
                    </Link>

                    {/* 2. Secciones Dinámicas (Ya vienen ordenadas) */}
                    {sections.map((sec) => (
                        <Link
                            key={sec.id}
                            href={`/seccion/${sec.slug}`}
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded transition capitalize"
                        >
                            {sec.name}
                        </Link>
                    ))}
                </div>

                {/* Botones Derecha (Admin y Móvil) */}
                <div className="flex items-center gap-4 z-50">
                    <Link href="/panel" className="hidden sm:block text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                        Admin
                    </Link>

                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-600 p-1 rounded hover:bg-gray-100 focus:outline-none">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* --- MENÚ MÓVIL --- */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg flex flex-col p-4 animate-in slide-in-from-top-5 h-screen overflow-y-auto pb-20">

                    {/* 1. Inicio Móvil */}
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-bold text-gray-900 py-3 border-b border-gray-100"
                    >
                        Inicio
                    </Link>

                    {/* 2. Secciones Móvil */}
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

                    <Link href="/panel" onClick={() => setIsOpen(false)} className="text-lg font-bold text-white bg-slate-900 py-3 px-4 rounded mt-4 text-center">
                        Panel Administrativo
                    </Link>
                </div>
            )}
        </nav>
    );
}