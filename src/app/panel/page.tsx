import { auth } from '@/auth';

export default async function PanelPage() {
    const session = await auth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Control</h1>

            <div className="bg-white p-6 rounded-lg shadow border">
                <h2 className="text-xl font-semibold mb-2">Bienvenido, {session?.user?.name}</h2>
                <p className="text-gray-600">
                    Has ingresado como <span className="font-bold uppercase text-blue-600">{session?.user?.role}</span>.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                    Desde aquí podrás gestionar las noticias, subir imágenes y controlar el contenido del portal.
                    Usa el menú de la izquierda para navegar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Estadísticas rápidas (Fake data por ahora) */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="text-blue-800 font-bold text-lg">Noticias Publicadas</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">0</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-green-800 font-bold text-lg">Secciones Activas</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">4</p>
                </div>
            </div>
        </div>
    );
}