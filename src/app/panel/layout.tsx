import { auth } from '@/auth'; // Tu autenticación
import AdminSidebar from '@/components/AdminSidebar';
import { redirect } from 'next/navigation';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    // Seguridad básica: si no hay usuario, fuera
    if (!session?.user) {
        redirect('/api/auth/signin');
    }

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Pasamos el usuario (con su rol) al Sidebar */}
            <AdminSidebar user={session.user} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Barra móvil */}
                <div className="md:hidden h-16 bg-white border-b flex items-center px-4 font-bold text-gray-800 shadow-sm justify-between">
                    <span>Panel Administrativo</span>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>

        </div>
    );
}