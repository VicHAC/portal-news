'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function NavSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [term, setTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (term.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(term)}`);
            setIsOpen(false); // Cerrar al buscar
        }
    };

    return (
        <div className="relative flex items-center">
            {/* INPUT DESPLEGABLE */}
            <div
                className={`
          flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-gray-100 rounded-full
          ${isOpen ? 'w-48 md:w-64 opacity-100 mr-2' : 'w-0 opacity-0'}
        `}
            >
                <form onSubmit={handleSearch} className="w-full flex items-center">
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full bg-transparent border-none text-sm px-4 py-2 focus:ring-0 outline-none text-gray-700"
                        autoFocus={isOpen}
                    />
                </form>
                {/* Botón X para cerrar */}
                {isOpen && (
                    <button
                        onClick={() => { setIsOpen(false); setTerm(''); }}
                        className="pr-3 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* BOTÓN LUPA */}
            <button
                onClick={() => {
                    if (isOpen && term) {
                        // Si está abierto y hay texto, buscar
                        router.push(`/buscar?q=${encodeURIComponent(term)}`);
                    } else {
                        // Si no, abrir/cerrar
                        setIsOpen(!isOpen);
                    }
                }}
                className={`
            p-2 rounded-full transition-colors
            ${isOpen ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}
        `}
            >
                <Search size={20} />
            </button>
        </div>
    );
}