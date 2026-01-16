import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { handleSignOut } from '@/app/actions/signout';
import { LayoutDashboard, PenSquare, LogOut, Newspaper } from 'lucide-react';

export default async function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Doble seguridad: si no hay sesión, fuera.
    if (!session?.user) {
        redirect('/iniciarsesion');
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar (Barra Lateral) */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold">Admin Portal</h2>
                    <p className="text-xs text-slate-400 mt-1">Hola, {session.user.name}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/panel"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded transition"
                    >
                        <LayoutDashboard size={20} />
                        Inicio
                    </Link>

                    <Link
                        href="/panel/crear"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded transition"
                    >
                        <PenSquare size={20} />
                        Crear Noticia
                    </Link>

                    <Link
                        href="/panel/noticias"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded transition"
                    >
                        <Newspaper size={20} />
                        Ver Noticias
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action={handleSignOut}>
                        <button className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-red-900/20 rounded transition">
                            <LogOut size={20} />
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}