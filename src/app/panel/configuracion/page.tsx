import prisma from '@/lib/prisma';
import { updateSiteConfig } from '@/app/actions/settings-actions';
import { Save, Settings, Image as ImageIcon, UploadCloud } from 'lucide-react';
import Image from 'next/image';

export const revalidate = 0;

export default async function ConfiguracionPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Settings size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Configuración Global</h1>
                    <p className="text-gray-500">Ajustes generales del sitio web</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-lg text-gray-800">Parámetros del Sistema</h2>
                </div>

                <form action={updateSiteConfig} className="p-6 space-y-8">

                    {/* SECCIÓN LOGO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo del Sitio</label>
                            <p className="text-xs text-gray-500">Aparece en la barra de navegación. Se recomienda formato PNG o SVG con fondo transparente.</p>
                        </div>

                        <div className="md:col-span-2 flex flex-col sm:flex-row gap-6 items-center">
                            {/* Previsualización Actual */}
                            <div className="relative w-40 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                {config?.logoUrl ? (
                                    <Image src={config.logoUrl} alt="Logo actual" fill className="object-contain p-2" />
                                ) : (
                                    <span className="text-xs text-gray-400 font-medium">Sin logo</span>
                                )}
                            </div>

                            {/* Input de Archivo */}
                            <div className="flex-1 w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                                        <UploadCloud size={24} className="mb-2 text-gray-400" />
                                        <p className="text-sm font-medium">Clic para cambiar logo</p>
                                        <p className="text-xs text-gray-400">PNG, JPG o SVG (Max. 2MB)</p>
                                    </div>
                                    <input name="logo" type="file" className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* OTROS AJUSTES (Ya existentes) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Noticias en Home</label>
                            <input
                                name="homeNewsCount"
                                type="number"
                                defaultValue={config?.homeNewsCount || 10}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Cantidad de noticias a mostrar antes de paginar.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Máx. Fotos Galería</label>
                            <input
                                name="maxCollageImages"
                                type="number"
                                defaultValue={config?.maxCollageImages || 6}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Límite de imágenes permitidas en collages.</p>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition transform active:scale-95">
                            <Save size={18} /> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}