'use client';

import { updateAuthor, deleteAuthor } from '@/app/actions/settings-actions';
import { Trash2, Save, Camera } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { useState } from 'react';

interface Author { id: string; name: string; image: string | null }

interface Props {
    author: Author;
    isAdmin: boolean; // <--- NUEVA PROP
}

export default function AuthorRow({ author, isAdmin }: Props) {
    const formId = `update-author-${author.id}`;
    const fileInputId = `file-input-${author.id}`;
    const [preview, setPreview] = useState(author.image);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    // --- VISTA SOLO LECTURA (EDITOR) ---
    if (!isAdmin) {
        return (
            <tr className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 w-20">
                    <div className="w-12 h-12 rounded-full overflow-hidden border shadow-sm relative bg-gray-100">
                        {author.image ? (
                            <Image src={author.image} alt={author.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                        )}
                    </div>
                </td>
                <td className="p-4 font-medium text-gray-700">{author.name}</td>
                <td className="p-4 text-right text-xs text-gray-400 italic">Solo lectura</td>
            </tr>
        );
    }

    // --- VISTA EDITABLE (ADMIN) ---
    return (
        <tr className="border-b last:border-0 hover:bg-gray-50 transition">
            <td className="hidden">
                <form id={formId} action={updateAuthor}>
                    <input type="hidden" name="id" value={author.id} />
                </form>
            </td>

            {/* Foto Editable */}
            <td className="p-4 w-20">
                <div className="relative group cursor-pointer w-12 h-12">
                    <label htmlFor={fileInputId} className="block w-full h-full relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border shadow-sm relative bg-gray-100">
                            {preview ? (
                                <Image src={preview} alt={author.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={18} className="text-white" />
                        </div>
                    </label>
                    <input
                        id={fileInputId} type="file" name="image" form={formId} accept="image/*"
                        className="hidden" onChange={handleImageChange}
                    />
                </div>
            </td>

            {/* Nombre Editable */}
            <td className="p-4">
                <input
                    form={formId} name="name" defaultValue={author.name}
                    className="w-full border-gray-300 border rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
            </td>

            {/* Botones */}
            <td className="p-4 text-right flex justify-end gap-2 items-center">
                <SaveButton formId={formId} />
                <form action={deleteAuthor.bind(null, author.id)}>
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                        <Trash2 size={18} />
                    </button>
                </form>
            </td>
        </tr>
    );
}

function SaveButton({ formId }: { formId: string }) {
    const { pending } = useFormStatus();
    return (
        <button form={formId} disabled={pending} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <Save size={18} className={pending ? 'animate-pulse' : ''} />
        </button>
    );
}