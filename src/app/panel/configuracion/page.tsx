import Link from 'next/link';
import { Users, Layout, PenTool, BookOpen, Settings, Camera } from 'lucide-react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ConfiguracionPage() {
    const session = await auth();

    // Seguridad extra: Si no es admin, lo echamos al panel normal
    if (session?.user?.role !== 'ADMIN') redirect('/panel');

    // Aquí definimos los botones del menú. Agregué el último: "General"
    const menuItems = [
        {
            title: 'General',
            desc: 'Portada y ajustes globales',
            icon: Settings,
            href: '/panel/configuracion/general', // <--- La ruta nueva que creaste
            color: 'text-gray-600 bg-gray-100'
        },
        {
            title: 'Usuarios',
            desc: 'Gestionar Admins y Editores',
            icon: Users,
            href: '/panel/configuracion/usuarios',
            color: 'text-purple-600 bg-purple-100'
        },
        {
            title: 'Secciones',
            desc: 'Categorías de noticias',
            icon: Layout,
            href: '/panel/configuracion/secciones',
            color: 'text-blue-600 bg-blue-100'
        },
        {
            title: 'Autores',
            desc: 'Fotos y nombres',
            icon: PenTool,
            href: '/panel/configuracion/autores',
            color: 'text-green-600 bg-green-100'
        },
        {
            title: 'Columnas',
            desc: 'Nombres de columnas',
            icon: BookOpen,
            href: '/panel/configuracion/columnas',
            color: 'text-orange-600 bg-orange-100'
        },
        {
            title: 'Fotógrafos',
            desc: 'Créditos de imágenes',
            icon: Camera,
            href: '/panel/configuracion/autores-imagen',
            color: 'text-indigo-600 bg-indigo-100'
        },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Configuración del Sitio</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-100 flex flex-col items-center text-center group"
                    >
                        <div className={`p-4 rounded-full mb-4 ${item.color} group-hover:scale-110 transition`}>
                            <item.icon size={32} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}