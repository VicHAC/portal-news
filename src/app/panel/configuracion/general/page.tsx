import prisma from '@/lib/prisma';
import { updateSiteConfig } from '@/app/actions/settings-actions'; // <--- OJO: Ruta corregida
import { Settings, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { SubmitButton } from '@/components/SubmitButton'; // <--- Importamos el botón con feedback

// Forzamos que esta página no se guarde en caché para ver los cambios al instante
export const dynamic = 'force-dynamic';

export default async function GeneralConfigPage() {
    // Obtenemos la configuración
    const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });

    // Valores por defecto
    const homeCount = config?.homeNewsCount || 10;
    const collageLimit = config?.maxCollageImages || 6;

    return (
        <div className="max-w-2xl"> {/* Aumenté un poco el ancho para que quepa bien el logo */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Configuración General</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-6 flex items-center gap-2 text-gray-700 pb-4 border-b">
                    <Settings size={20} /> Ajustes Globales
                </h3>

                <form action={updateSiteConfig} className="space-y-8">

                    {/* --- NUEVA SECCIÓN: LOGO --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <ImageIcon size={18} /> Logo del Sitio
                        </label>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Previsualización */}
                            <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center w-full md:w-48 h-32 shrink-0">
                                {config?.logoUrl ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={config.logoUrl}
                                            alt="Logo actual"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400 italic">Sin logo</span>
                                )}
                            </div>

                            {/* Input de Archivo */}
                            <div className="flex-1 w-full">
                                <input
                                    type="file"
                                    name="logo" // <--- IMPORTANTE: Este nombre conecta con el Server Action
                                    accept="image/png, image/jpeg, image/webp"
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100
                                        cursor-pointer border border-gray-300 rounded-lg
                                    "
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Sube tu imagen (PNG recomendado con fondo transparente).
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

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
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Cantidad de noticias a mostrar debajo de la destacada.
                        </p>
                    </div>

                    {/* Campo 2: Límite Collage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Límite de fotos en Collage
                        </label>
                        <input
                            type="number"
                            name="maxCollageImages"
                            defaultValue={collageLimit}
                            min={0}
                            max={20}
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Número máximo de imágenes permitidas en la galería de una noticia.
                        </p>
                    </div>

                    {/* BOTÓN DE GUARDAR (Usamos el componente inteligente) */}
                    <div className="pt-4">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}