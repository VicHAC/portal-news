'use client'; // <--- ESTO ES LA CLAVE: Habilita la interactividad

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

interface Section {
    id: string;
    name: string;
    slug: string;
}

export default function MobileMenu({ sections }: { sections: Section[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* BOTÓN HAMBURGUESA / CERRAR */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Abrir menú"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* LISTA DESPLEGABLE */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col p-4 space-y-2">

                        {/* Enlace Inicio */}
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 text-sm font-bold text-gray-800 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            INICIO
                        </Link>

                        {/* Secciones Dinámicas */}
                        {sections.map((section) => (
                            <Link
                                key={section.id}
                                href={`/seccion/${section.slug}`}
                                onClick={() => setIsOpen(false)} // Cierra el menú al hacer click
                                className="px-4 py-3 text-sm font-bold text-gray-600 uppercase rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                                {section.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}