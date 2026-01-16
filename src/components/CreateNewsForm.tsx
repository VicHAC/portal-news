'use client';

import { createArticle } from '@/app/actions/news-actions';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Image as ImageIcon, Save, Images } from 'lucide-react';

interface Props {
    sections: { id: string; name: string; slug: string }[];
    authors: { id: string; name: string }[];
    columns: { id: string; name: string }[];
    imageAuthors: { id: string; name: string }[]; // <--- NUEVO
    maxCollage: number; // <--- NUEVO
}

export default function CreateNewsForm({ sections, authors, columns, imageAuthors, maxCollage }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [collageCount, setCollageCount] = useState(0);

    // Vista previa imagen principal
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    // Controlar cantidad de fotos en collage
    const handleCollageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const count = e.target.files.length;
            if (count > maxCollage) {
                alert(`Has seleccionado ${count} fotos. El máximo permitido es ${maxCollage}.`);
                e.target.value = ''; // Limpiar selección
                setCollageCount(0);
            } else {
                setCollageCount(count);
            }
        }
    };

    return (
        <form action={createArticle} className="bg-white p-6 rounded-lg shadow space-y-6">

            {/* Título */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                    name="title"
                    type="text"
                    required
                    placeholder="Titular de la noticia..."
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Selectores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sección */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
                    <select name="section" className="w-full border p-2 rounded bg-white" required>
                        <option value="">-- Selecciona --</option>
                        {sections.map((s) => <option key={s.id} value={s.slug}>{s.name}</option>)}
                    </select>
                </div>

                {/* Redactor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Redactor</label>
                    <select name="author" className="w-full border p-2 rounded bg-white">
                        <option value="">Redacción</option>
                        {authors.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
                    </select>
                </div>

                {/* Columna */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Columna</label>
                    <select name="columnName" className="w-full border p-2 rounded bg-white">
                        <option value="">Ninguna</option>
                        {columns.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>

                {/* NUEVO: Fotógrafo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fotógrafo</label>
                    <select name="imageAuthor" className="w-full border p-2 rounded bg-white">
                        <option value="">Sin crédito / Redacción</option>
                        {imageAuthors.map((ia) => <option key={ia.id} value={ia.name}>{ia.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Imagen Principal */}
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
                            <span className="text-sm">Arrastra una imagen aquí</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Resumen */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumen (Opcional)</label>
                <textarea
                    name="summary"
                    rows={2}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Contenido */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea
                    name="content"
                    required
                    rows={12}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none font-serif text-lg leading-relaxed"
                />
            </div>

            {/* NUEVO: Collage */}
            <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Images size={18} /> Galería de Fotos (Opcional)
                </label>
                <div className="border border-gray-300 rounded p-4 bg-gray-50">
                    <input
                        type="file"
                        name="collage"
                        multiple
                        accept="image/*"
                        onChange={handleCollageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Seleccionadas: <span className="font-bold">{collageCount}</span> / Máximo permitido: <span className="font-bold">{maxCollage}</span>
                    </p>
                </div>
            </div>

            {/* Botón */}
            <div className="flex justify-end pt-4 border-t">
                <SubmitButton />
            </div>
        </form>
    );
}

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