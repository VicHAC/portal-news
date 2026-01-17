'use client';

import { createArticle } from '@/app/actions/news-actions';
import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Save, Images, X, Plus, Loader2, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // <--- IMPORTANTE

interface Props {
    sections: { id: string; name: string; slug: string }[];
    authors: { id: string; name: string }[];
    columns: { id: string; name: string }[];
    imageAuthors: { id: string; name: string }[];
    maxCollage: number;
}

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function CreateNewsForm({ sections, authors, columns, imageAuthors, maxCollage }: Props) {
    const router = useRouter(); // <--- INICIALIZAR ROUTER

    const [mainPreview, setMainPreview] = useState<string | null>(null);
    const [collageFiles, setCollageFiles] = useState<File[]>([]);
    const [collagePreviews, setCollagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [defaultDate, setDefaultDate] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const collageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const mexicoCityDate = new Date().toLocaleDateString('en-CA', {
            timeZone: 'America/Mexico_City',
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
        setDefaultDate(mexicoCityDate);
        return () => collagePreviews.forEach(url => URL.revokeObjectURL(url));
    }, [collagePreviews]);

    // ... (Manejadores handleImageChange, handleCollageSelect, removeCollagePhoto IGUALES QUE ANTES) ...
    // (Omito el código repetido de manejo de imágenes para ahorrar espacio, usa el que ya tenías)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_BYTES) { alert('Imagen muy pesada'); return; }
            setMainPreview(URL.createObjectURL(file));
        }
    };

    const handleCollageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles: File[] = [];
            for (const file of newFiles) {
                if (file.size > MAX_FILE_SIZE_BYTES) continue;
                validFiles.push(file);
            }
            const totalPotential = collageFiles.length + validFiles.length;
            if (totalPotential > maxCollage) {
                alert(`Límite de ${maxCollage} fotos.`);
                validFiles.length = maxCollage - collageFiles.length;
            }
            setCollageFiles(prev => [...prev, ...validFiles]);
            setCollagePreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
            if (collageInputRef.current) collageInputRef.current.value = '';
        }
    };

    const removeCollagePhoto = (idx: number) => {
        setCollageFiles(prev => prev.filter((_, i) => i !== idx));
        setCollagePreviews(prev => { URL.revokeObjectURL(prev[idx]); return prev.filter((_, i) => i !== idx); });
    };

    // --- SUBMIT CORREGIDO ---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            formData.delete('collage');
            collageFiles.forEach((file) => formData.append('collage', file));

            // 1. LLAMAMOS AL SERVER (Ya no hace redirect, solo devuelve ok)
            await createArticle(formData);

            // 2. SI LLEGAMOS AQUÍ, FUE UN ÉXITO -> REDIRIGIMOS MANUALMENTE
            router.push('/panel');
            router.refresh();

        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al crear la noticia.');
            setIsSubmitting(false);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">

            {/* TÍTULO Y FECHA */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input name="title" type="text" required placeholder="Titular..." className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Calendar size={14} /> Fecha (CDMX)</label>
                    <input type="date" name="date" defaultValue={defaultDate} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600 font-medium" />
                </div>
            </div>

            {/* SELECTORES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
                    <select name="section" className="w-full border p-2 rounded bg-white" required>
                        <option value="">-- Selecciona --</option>
                        {sections.map((s) => <option key={s.id} value={s.slug}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Redactor</label>
                    <select name="author" className="w-full border p-2 rounded bg-white">
                        <option value="">Sin crédito</option>
                        {authors.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Columna</label>
                    <select name="columnName" className="w-full border p-2 rounded bg-white">
                        <option value="">Ninguna</option>
                        {columns.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fotógrafo</label>
                    <select name="imageAuthor" className="w-full border p-2 rounded bg-white">
                        <option value="">Sin crédito</option>
                        {imageAuthors.map((ia) => <option key={ia.id} value={ia.name}>{ia.name}</option>)}
                    </select>
                </div>
            </div>

            {/* IMAGEN Y TEXTOS */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition relative min-h-[160px] flex flex-col items-center justify-center">
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {mainPreview ? (
                        <img src={mainPreview} alt="Vista previa" className="max-h-64 rounded shadow object-contain relative z-0" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400"><ImageIcon size={48} className="mb-2" /><span className="text-sm">Clic para subir foto principal</span></div>
                    )}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumen</label>
                <textarea name="summary" rows={2} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea name="content" required rows={12} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none font-serif text-lg leading-relaxed" />
            </div>

            {/* GALERÍA */}
            <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Images size={18} /> Galería de Fotos</div>
                    <span className="text-xs text-gray-500 font-normal">{collageFiles.length} de {maxCollage} fotos</span>
                </label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                        {collagePreviews.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 shadow-sm group">
                                <Image src={url} alt="Preview" fill className="object-cover" />
                                <button type="button" onClick={() => removeCollagePhoto(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-90 hover:bg-red-600 transition shadow-sm z-10"><X size={12} /></button>
                            </div>
                        ))}
                        {collageFiles.length < maxCollage && (
                            <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-blue-500">
                                <Plus size={24} /><span className="text-xs font-medium mt-1">Agregar</span>
                                <input ref={collageInputRef} type="file" multiple accept="image/*" onChange={handleCollageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        )}
                    </div>
                    {collageFiles.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No has seleccionado fotos.</p>}
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <button type="submit" disabled={isSubmitting} className={`flex items-center gap-2 px-6 py-2 rounded text-white font-medium transition ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSubmitting ? 'Publicando...' : 'Publicar Noticia'}
                </button>
            </div>
        </form>
    );
}