import prisma from '@/lib/prisma';
import { createImageAuthor, deleteImageAuthor } from '@/app/actions/settings-actions';
import { Trash2, Camera } from 'lucide-react';

export default async function ImageAuthorsConfigPage() {
    const authors = await prisma.imageAuthor.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Fotógrafos / Autores de Imagen</h2>

            <div className="bg-white p-6 rounded-lg shadow mb-8 border">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Camera size={20} /> Nuevo Fotógrafo</h3>
                <form action={createImageAuthor} className="flex gap-4">
                    <input name="name" placeholder="Ej: Agencia EFE, Juan Foto..." required className="flex-1 border p-2 rounded" />
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-medium">Agregar</button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Nombre / Agencia</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map((author) => (
                            <tr key={author.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium">{author.name}</td>
                                <td className="p-4 text-right">
                                    <form action={deleteImageAuthor.bind(null, author.id)}>
                                        <button className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}