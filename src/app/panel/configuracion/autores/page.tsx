import prisma from '@/lib/prisma';
import { createAuthor, deleteAuthor } from '@/app/actions/settings-actions';
import { Trash2, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default async function AutoresConfigPage() {
    const authors = await prisma.author.findMany();

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Gestionar Autores</h2>

            <div className="bg-white p-6 rounded-lg shadow mb-8 border">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><UserPlus size={20} /> Nuevo Autor</h3>
                <form action={createAuthor} className="grid gap-4">
                    <div className="flex gap-4">
                        <input name="name" placeholder="Nombre completo" required className="flex-1 border p-2 rounded" />
                        <input name="bio" placeholder="Biografía corta (opcional)" className="flex-1 border p-2 rounded" />
                    </div>
                    <div className="flex gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700">Foto:</label>
                        <input type="file" name="image" accept="image/*" className="text-sm" />
                        <button type="submit" className="ml-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium">Guardar Autor</button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {authors.map((author) => (
                    <div key={author.id} className="bg-white p-4 rounded-lg shadow border flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {author.image ? (
                                <Image src={author.image} alt={author.name} width={50} height={50} className="rounded-full object-cover h-12 w-12" />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">?</div>
                            )}
                            <div>
                                <h4 className="font-bold">{author.name}</h4>
                                <p className="text-xs text-gray-500">{author.bio || 'Sin biografía'}</p>
                            </div>
                        </div>
                        <form action={deleteAuthor.bind(null, author.id)}>
                            <button className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                                <Trash2 size={18} />
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
}