import prisma from '@/lib/prisma';
import { createAuthor } from '@/app/actions/settings-actions';
import { PenTool } from 'lucide-react';
import AuthorRow from '@/components/AuthorRow';
import { auth } from '@/auth';

export default async function AutoresPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    const authors = await prisma.author.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Gestionar Autores (Redactores)</h2>

            {/* SOLO ADMIN PUEDE CREAR */}
            {isAdmin && (
                <div className="bg-white p-6 rounded-lg shadow mb-8 border border-purple-100">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-purple-700">
                        <PenTool size={20} /> Nuevo Autor
                    </h3>
                    <form action={createAuthor} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500">Nombre</label>
                            <input name="name" required className="w-full border p-2 rounded" />
                        </div>
                        {/* Aquí podrías agregar input file para crear con foto si lo implementaste */}
                        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 h-[42px]">Crear</button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Foto</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map((author) => (
                            <AuthorRow
                                key={author.id}
                                author={author}
                                isAdmin={isAdmin} // <--- PASAMOS PERMISO
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}