import prisma from '@/lib/prisma';
import { createColumn, deleteColumn } from '@/app/actions/settings-actions';
import { Trash2, BookOpen } from 'lucide-react';

export default async function ColumnasConfigPage() {
    const columns = await prisma.column.findMany();

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Gestionar Columnas</h2>

            <div className="bg-white p-6 rounded-lg shadow mb-8 border">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><BookOpen size={20} /> Nueva Columna</h3>
                <form action={createColumn} className="flex gap-4">
                    <input name="name" placeholder="Nombre de la Columna (ej: Opinión Central)" required className="flex-1 border p-2 rounded" />
                    <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 font-medium">Agregar</button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Nombre de la Columna</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {columns.map((col) => (
                            <tr key={col.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{col.name}</td>
                                <td className="p-4 text-right">
                                    <form action={deleteColumn.bind(null, col.id)}>
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