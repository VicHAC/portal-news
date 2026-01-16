import prisma from '@/lib/prisma';
import { updateSiteConfig } from '@/app/actions/news-actions';
import { Settings } from 'lucide-react';

export default async function GeneralConfigPage() {
    // Obtenemos la configuración o usamos valores por defecto
    const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });
    const homeCount = config?.homeNewsCount || 10;
    const collageLimit = config?.maxCollageImages || 6;

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-6">Configuración General</h2>

            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Settings size={20} /> Ajustes Globales
                </h3>

                <form action={updateSiteConfig} className="space-y-6">

                    {/* Campo 1: Noticias en Home */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Noticias recientes en Inicio
                        </label>
                        <input
                            type="number"
                            name="homeNewsCount"
                            defaultValue={homeCount}
                            min={1}
                            max={50}
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Cantidad de noticias a mostrar debajo de la destacada.
                        </p>
                    </div>

                    {/* Campo 2: Límite Collage (NUEVO) */}
                    <div className="pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Límite de fotos en Collage
                        </label>
                        <input
                            type="number"
                            name="maxCollageImages"
                            defaultValue={collageLimit}
                            min={0}
                            max={20}
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Número máximo de imágenes permitidas en la galería de una noticia.
                        </p>
                    </div>

                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto">
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
}