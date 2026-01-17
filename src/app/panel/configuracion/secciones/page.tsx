import prisma from '@/lib/prisma';
import { createSection } from '@/app/actions/settings-actions';
import { Plus, Palette, ArrowUpDown } from 'lucide-react';
import SectionRow from '@/components/SectionRow';
import { auth } from '@/auth';

export default async function SeccionesConfigPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN'; // Verificar rol

    const sections = await prisma.section.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="max-w-5xl">
            <h2 className="text-2xl font-bold mb-6">Gestionar Secciones</h2>

            {/* SOLO ADMIN PUEDE CREAR */}
            {isAdmin && (
                <div className="bg-white p-6 rounded-lg shadow mb-8 border border-blue-100">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <Plus size={20} className="text-blue-600" /> Nueva Sección
                    </h3>
                    <form action={createSection} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-bold text-gray-500 mb-1 block">Nombre</label>
                            <input name="name" placeholder="Ej: Internacional" required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="w-full md:w-24">
                            <label className="text-xs font-bold text-gray-500 mb-1 block flex items-center gap-1"><ArrowUpDown size={12} /> Orden</label>
                            <input name="order" type="number" defaultValue="0" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="w-full md:w-24">
                            <label className="text-xs font-bold text-gray-500 mb-1 block flex items-center gap-1"><Palette size={12} /> Color</label>
                            <div className="h-[42px] border rounded flex items-center justify-center bg-white px-2">
                                <input name="color" type="color" defaultValue="#2563eb" className="w-8 h-8 cursor-pointer bg-transparent border-none p-0" />
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 font-medium h-full w-full md:w-auto shadow-sm">Agregar</button>
                    </form>
                </div>
            )}

            {/* Tabla Editable */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="p-4 w-24">Orden</th>
                            <th className="p-4 w-32">Color</th>
                            <th className="p-4">Nombre de Sección</th>
                            <th className="p-4 text-right w-32">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sections.map((sec) => (
                            <SectionRow
                                key={sec.id}
                                section={sec}
                                isAdmin={isAdmin} // <--- PASAMOS PERMISO
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}