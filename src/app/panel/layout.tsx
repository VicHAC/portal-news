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

    if (!session?.user) {
        redirect('/iniciarsesion');
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen sticky top-0">

                {/* CABECERA (Ahora incluye el botón de salir) */}
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold tracking-tight">Admin Portal</h2>
                    <p className="text-xs text-slate-400 mt-1 mb-6 truncate">
                        Hola, {session.user.name}
                    </p>

                    {/* BOTÓN MOVIDO AQUÍ - AL PRINCIPIO */}
                    <form action={handleSignOut}>
                        <button className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded transition-all duration-200 font-medium text-sm">
                            <LogOut size={16} />
                            Cerrar Sesión
                        </button>
                    </form>
                </div>

                {/* NAVEGACIÓN */}
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/panel"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded transition group"
                    >
                        <LayoutDashboard size={20} className="group-hover:text-blue-400 transition-colors" />
                        <span className="font-medium">Inicio</span>
                    </Link>

                    <Link
                        href="/panel/crear"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded transition group"
                    >
                        <PenSquare size={20} className="group-hover:text-blue-400 transition-colors" />
                        <span className="font-medium">Crear Noticia</span>
                    </Link>

                    <Link
                        href="/panel/noticias"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded transition group"
                    >
                        <Newspaper size={20} className="group-hover:text-blue-400 transition-colors" />
                        <span className="font-medium">Gestionar Noticias</span>
                    </Link>
                </nav>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}