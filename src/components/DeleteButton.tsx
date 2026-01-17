'use client'; // <--- ESTO ES LA CLAVE

import { Trash2 } from 'lucide-react';

interface Props {
    className?: string;
    iconSize?: number;
    showText?: boolean;
}

export default function DeleteButton({ className, iconSize = 18, showText = false }: Props) {
    return (
        <button
            className={className}
            onClick={(e) => {
                // Esta lógica solo funciona en el cliente (navegador)
                if (!confirm('¿Estás seguro de que quieres eliminar esta noticia? Esta acción no se puede deshacer.')) {
                    e.preventDefault(); // Detiene el borrado si cancelan
                }
            }}
        >
            <Trash2 size={iconSize} />
            {showText && <span>Borrar</span>}
        </button>
    );
}