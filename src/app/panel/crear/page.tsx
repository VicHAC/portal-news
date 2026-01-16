import prisma from '@/lib/prisma';
import CreateNewsForm from '@/components/CreateNewsForm';

export default async function CrearNoticiaPage() {
    // Obtenemos todos los datos necesarios en paralelo para que sea rápido
    const [sections, authors, columns, imageAuthors, config] = await Promise.all([
        prisma.section.findMany({ orderBy: { name: 'asc' } }),
        prisma.author.findMany({ orderBy: { name: 'asc' } }),
        prisma.column.findMany({ orderBy: { name: 'asc' } }),
        prisma.imageAuthor.findMany({ orderBy: { name: 'asc' } }), // <--- Fotógrafos
        prisma.siteConfig.findUnique({ where: { id: 'global' } }), // <--- Configuración
    ]);

    // Si no hay configuración guardada, usamos 6 por defecto
    const maxCollage = config?.maxCollageImages || 6;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Redactar Nueva Noticia</h1>

            <CreateNewsForm
                sections={sections}
                authors={authors}
                columns={columns}
                imageAuthors={imageAuthors}
                maxCollage={maxCollage}
            />
        </div>
    );
}