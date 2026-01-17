import prisma from '@/lib/prisma';
import { createColumn, updateColumn, deleteColumn } from '@/app/actions/settings-actions';
import { BookOpen } from 'lucide-react';
import EditableNameRow from '@/components/EditableNameRow';
import { auth } from '@/auth'; // Importar Auth

export default async function ColumnasPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN'; // Verificar rol

    const columns = await prisma.column.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Gestionar Columnas</h2>

            {/* SOLO ADMIN PUEDE CREAR */}
            {isAdmin && (
                <div className="bg-white p-6 rounded-lg shadow mb-8 border border-orange-100">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-orange-700">
                        <BookOpen size={20} /> Nueva Columna
                    </h3>
                    <form action={createColumn} className="flex gap-4">
                        <input name="name" placeholder="Nombre de la columna..." required className="flex-1 border p-2 rounded" />
                        <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">Agregar</button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Nombre</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {columns.map((col) => (
                            <EditableNameRow
                                key={col.id}
                                item={col}
                                updateAction={updateColumn}
                                deleteAction={deleteColumn}
                                isAdmin={isAdmin} // <--- PASAMOS EL PERMISO
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}