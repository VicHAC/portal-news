'use client';

import { Trash2 } from 'lucide-react';

interface Props {
    className?: string;
    iconSize?: number;
    showText?: boolean;
    disabled?: boolean; // <--- Nueva propiedad para controlar permisos
}

export default function DeleteButton({ className, iconSize = 18, showText = false, disabled = false }: Props) {

    // VISTA DESHABILITADA (EDITOR)
    if (disabled) {
        return (
            <button
                type="button"
                disabled
                className={`${className} opacity-40 cursor-not-allowed grayscale`}
                title="Solo el Administrador puede borrar noticias"
            >
                <Trash2 size={iconSize} />
                {showText && <span>Borrar</span>}
            </button>
        );
    }

    // VISTA HABILITADA (ADMIN)
    return (
        <button
            className={className}
            onClick={(e) => {
                if (!confirm('¿Estás seguro de que quieres eliminar esta noticia? Esta acción no se puede deshacer.')) {
                    e.preventDefault();
                }
            }}
            title="Eliminar noticia permanentemente"
        >
            <Trash2 size={iconSize} />
            {showText && <span>Borrar</span>}
        </button>
    );
}