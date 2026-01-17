'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface Props {
    images: string[];
}

export default function ImageCarousel({ images }: Props) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-l-4 border-blue-600 pl-3">
                Galería de Imágenes
            </h3>

            {/* CARRUSEL DE DESPLAZAMIENTO HORIZONTAL */}
            <div className="relative group">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 custom-scrollbar">
                    {images.map((imgUrl, index) => (
                        <div
                            key={index}
                            className="snap-center shrink-0 w-[85%] md:w-[45%] h-64 md:h-80 relative rounded-lg overflow-hidden shadow-sm cursor-pointer hover:opacity-90 transition border border-gray-100"
                            onClick={() => setSelectedImage(imgUrl)}
                        >
                            <Image
                                src={imgUrl}
                                alt={`Imagen ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-2 md:hidden">Desliza para ver más →</p>
            </div>

            {/* LIGHTBOX (MODAL PARA VER FOTO GRANDE) */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)} // Cerrar al hacer click afuera
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-50 bg-black/50 rounded-full"
                    >
                        <X size={32} />
                    </button>

                    <div className="relative w-full max-w-6xl h-[85vh]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={selectedImage}
                            alt="Vista completa"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}