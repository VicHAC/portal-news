import prisma from '@/lib/prisma';
import { createImageAuthor, updateImageAuthor, deleteImageAuthor } from '@/app/actions/settings-actions';
import { Camera } from 'lucide-react';
import EditableNameRow from '@/components/EditableNameRow';
import { auth } from '@/auth';

export default async function ImageAuthorsConfigPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    const authors = await prisma.imageAuthor.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Fotógrafos / Créditos</h2>

            {/* SOLO ADMIN PUEDE CREAR */}
            {isAdmin && (
                <div className="bg-white p-6 rounded-lg shadow mb-8 border border-indigo-100">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-indigo-700">
                        <Camera size={20} /> Nuevo Fotógrafo
                    </h3>
                    <form action={createImageAuthor} className="flex gap-4">
                        <input name="name" placeholder="Nombre o Agencia..." required className="flex-1 border p-2 rounded" />
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Agregar</button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Nombre / Agencia</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map((author) => (
                            <EditableNameRow
                                key={author.id}
                                item={author}
                                updateAction={updateImageAuthor}
                                deleteAction={deleteImageAuthor}
                                isAdmin={isAdmin} // <--- PASAMOS PERMISO
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}