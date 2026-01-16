import prisma from '@/lib/prisma';
import { createUser, deleteUser } from '@/app/actions/settings-actions';
import { Trash2, UserPlus } from 'lucide-react';

export default async function UsuariosConfigPage() {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });

    return (
        <div className="max-w-5xl">
            <h2 className="text-2xl font-bold mb-6">Gestionar Usuarios</h2>

            {/* Formulario */}
            <div className="bg-white p-6 rounded-lg shadow mb-8 border">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><UserPlus size={20} /> Nuevo Usuario</h3>
                <form action={createUser} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input name="name" placeholder="Nombre completo" required className="border p-2 rounded" />
                    <input name="username" placeholder="Usuario (Login)" required className="border p-2 rounded" />
                    <input name="password" type="password" placeholder="Contraseña" required className="border p-2 rounded" />
                    <select name="role" className="border p-2 rounded bg-white">
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                    <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium">
                        Crear
                    </button>
                </form>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4 text-gray-600">{user.username}</td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <form action={deleteUser.bind(null, user.id)}>
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