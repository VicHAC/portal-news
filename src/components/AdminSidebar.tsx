'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    Newspaper,
    Settings,
    Users,
    Camera,
    Menu,
    X,
    LogOut,
    BookOpen,
    List,
    ExternalLink,
    UserCog // <--- 1. NUEVO ICONO IMPORTADO
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface User {
    name?: string | null;
    role?: string | unknown;
}

export default function AdminSidebar({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Aseguramos que role sea string para la comparación
    const isAdmin = String(user.role) === 'ADMIN';

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Botón Móvil */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-lg">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay Móvil */}
            {isOpen && <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" />}

            {/* SIDEBAR */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          md:sticky md:top-0 md:h-screen 
          shrink-0 flex flex-col shadow-xl
        `}
            >

                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
                    <span className="text-xl font-bold tracking-tight">Panel<span className="text-blue-500">Admin</span></span>
                </div>

                {/* Scrollable Content */}
                <nav className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">

                    {/* 1. PRINCIPAL */}
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Principal</p>
                        <div className="space-y-1">
                            <NavItem href="/panel" icon={LayoutDashboard} label="Dashboard" active={pathname === '/panel'} onClick={closeSidebar} />
                            <NavItem href="/panel/noticias" icon={Newspaper} label="Noticias" active={pathname === '/panel/noticias'} onClick={closeSidebar} />
                        </div>
                    </div>

                    {/* 2. DIRECTORIOS */}
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Directorios</p>
                        <div className="space-y-1">
                            <NavItem href="/panel/configuracion/secciones" icon={List} label="Secciones" active={pathname.includes('secciones')} onClick={closeSidebar} />
                            <NavItem href="/panel/configuracion/autores" icon={Users} label="Redactores" active={pathname.includes('autores') && !pathname.includes('imagen')} onClick={closeSidebar} />
                            <NavItem href="/panel/configuracion/columnas" icon={BookOpen} label="Columnas" active={pathname.includes('columnas')} onClick={closeSidebar} />
                            <NavItem href="/panel/configuracion/autores-imagen" icon={Camera} label="Fotógrafos" active={pathname.includes('autores-imagen')} onClick={closeSidebar} />
                        </div>
                    </div>

                    {/* 3. SISTEMA (Solo Admin) */}
                    {isAdmin && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Sistema</p>
                            <div className="space-y-1">
                                <NavItem
                                    href="/panel/configuracion"
                                    icon={Settings}
                                    label="Configuración Global"
                                    active={pathname === '/panel/configuracion'}
                                    onClick={closeSidebar}
                                />

                                {/* --- 2. AQUÍ AGREGAMOS EL LINK FALTANTE --- */}
                                <NavItem
                                    href="/panel/configuracion/usuarios"
                                    icon={UserCog}
                                    label="Gestión de Usuarios"
                                    active={pathname === '/panel/configuracion/usuarios'}
                                    onClick={closeSidebar}
                                />
                                {/* ----------------------------------------- */}

                            </div>
                        </div>
                    )}
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0 space-y-3">

                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
                    >
                        <ExternalLink size={18} /> Ver Sitio Web
                    </Link>

                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-red-400 border border-red-900/50 hover:bg-red-950/30 hover:text-red-300 hover:border-red-500/50 transition-all group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
}

// Helper component
function NavItem({ href, icon: Icon, label, active, onClick }: any) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${active ? 'bg-slate-800 text-white shadow-sm border-l-4 border-blue-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
            `}
        >
            <Icon size={18} /> {label}
        </Link>
    );
}