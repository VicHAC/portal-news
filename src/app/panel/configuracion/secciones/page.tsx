import prisma from '@/lib/prisma';
import { createSection, deleteSection } from '@/app/actions/settings-actions';
import { Trash2, Plus } from 'lucide-react';

export default async function SeccionesConfigPage() {
    const sections = await prisma.section.findMany();

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Gestionar Secciones</h2>

            <div className="bg-white p-6 rounded-lg shadow mb-8 border">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Plus size={20} /> Nueva Sección</h3>
                <form action={createSection} className="flex gap-4">
                    <input name="name" placeholder="Ej: Economía" required className="flex-1 border p-2 rounded" />
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">Agregar</button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Slug (URL)</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((sec) => (
                            <tr key={sec.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium">{sec.name}</td>
                                <td className="p-4 text-gray-500 font-mono text-sm">/seccion/{sec.slug}</td>
                                <td className="p-4 text-right">
                                    <form action={deleteSection.bind(null, sec.id)}>
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