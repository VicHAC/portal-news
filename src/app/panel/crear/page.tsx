'use client';

import { createArticle } from '@/app/actions/news-actions';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Image as ImageIcon, Save } from 'lucide-react';

export default function CrearNoticiaPage() {
    const [preview, setPreview] = useState<string | null>(null);

    // Función para mostrar preview de la imagen local
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Redactar Nueva Noticia</h1>

            <form action={createArticle} className="bg-white p-6 rounded-lg shadow space-y-6">

                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                        name="title"
                        type="text"
                        required
                        placeholder="Escribe un titular impactante..."
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Sección y Autor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
                        <select name="section" className="w-full border p-2 rounded bg-white">
                            <option value="politica">Política</option>
                            <option value="deportes">Deportes</option>
                            <option value="tecnologia">Tecnología</option>
                            <option value="cultura">Cultura</option>
                            <option value="opinion">Opinión</option>
                        </select>
                    </div>
                </div>

                {/* Subida de Imagen */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition relative">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {preview ? (
                            <img src={preview} alt="Vista previa" className="max-h-64 mx-auto rounded shadow" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <ImageIcon size={48} className="mb-2" />
                                <span className="text-sm">Haz clic o arrastra una imagen aquí</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resumen */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resumen (Opcional)
                    </label>
                    <textarea
                        name="summary"
                        rows={2}
                        placeholder="Si lo dejas vacío, se generará automáticamente del contenido."
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Contenido Principal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenido de la Noticia</label>
                    <textarea
                        name="content"
                        required
                        rows={15}
                        placeholder="Escribe aquí el cuerpo de la noticia..."
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none font-serif text-lg leading-relaxed"
                    />
                </div>

                {/* Botón de Guardar */}
                <div className="flex justify-end pt-4 border-t">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}

// Botón con estado de carga
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`flex items-center gap-2 px-6 py-2 rounded text-white font-medium transition
        ${pending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
            <Save size={18} />
            {pending ? 'Publicando...' : 'Publicar Noticia'}
        </button>
    );
}