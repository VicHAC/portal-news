'use server';

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

// --- ACCIÓN PARA CREAR NOTICIA ---
export async function createArticle(formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('No autorizado');

    // --- OBTENER CONFIGURACIÓN (Para el límite del collage) ---
    const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });
    const maxCollage = config?.maxCollageImages || 6;

    // 1. Datos básicos
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const section = formData.get('section') as string;
    const summaryRaw = formData.get('summary') as string;

    // 2. Selectores
    const authorSelect = formData.get('author') as string;
    const finalAuthor = authorSelect || session.user.name;

    const columnSelect = formData.get('columnName') as string;

    // NUEVO: Autor de Imagen
    const imageAuthorSelect = formData.get('imageAuthor') as string;

    // 3. Slug y Resumen
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const summary = summaryRaw || (content.slice(0, 160) + '...');

    // 4. IMAGEN PRINCIPAL
    const mainImageFile = formData.get('image') as File;
    let mainImageUrl = null;
    if (mainImageFile && mainImageFile.size > 0) {
        const blob = await put(`articles/${slug}-main-${mainImageFile.name}`, mainImageFile, { access: 'public' });
        mainImageUrl = blob.url;
    }

    // 5. COLLAGE DE FOTOS (Múltiples)
    const collageFiles = formData.getAll('collage') as File[]; // .getAll obtiene todos los archivos del input multiple
    let collageUrls: string[] = [];

    if (collageFiles && collageFiles.length > 0) {
        // Validar cantidad
        if (collageFiles.length > maxCollage) {
            throw new Error(`Has superado el límite de ${maxCollage} fotos para el collage.`);
        }

        // Subir todas en paralelo
        // Filtramos archivos vacíos (size > 0)
        const validFiles = collageFiles.filter(f => f.size > 0);

        const uploadPromises = validFiles.map((file, index) =>
            put(`articles/${slug}-collage-${index}-${file.name}`, file, { access: 'public' })
        );

        const results = await Promise.all(uploadPromises);
        collageUrls = results.map(r => r.url);
    }

    // 6. Guardar en DB
    await prisma.article.create({
        data: {
            title,
            slug,
            content,
            summary,
            section,
            mainImage: mainImageUrl,
            imageAuthor: imageAuthorSelect || null, // <--- Guardamos autor imagen
            collage: collageUrls,                   // <--- Guardamos array de fotos
            author: finalAuthor,
            columnName: columnSelect || null,
            published: true,
        },
    });

    revalidatePath('/');
    revalidatePath('/panel');
    redirect('/panel');
}

// --- ACCIÓN PARA BORRAR NOTICIA (SOLO ADMIN) ---
export async function deleteArticle(id: string) {
    const session = await auth();

    // 1. Verificar autenticación básica
    if (!session?.user) {
        throw new Error('No autorizado');
    }

    // 2. VERIFICAR ROL ADMIN (Seguridad Crítica)
    if (session.user.role !== 'ADMIN') {
        throw new Error('Permisos insuficientes. Solo administradores pueden borrar.');
    }

    // 3. Borrar de la Base de Datos
    await prisma.article.delete({
        where: { id },
    });

    // 4. Actualizar vistas
    revalidatePath('/');
    revalidatePath('/panel/noticias');
}

// ... (código existente create/delete)

// --- TOGGLE DESTACADA ---
export async function toggleFeatured(articleId: string) {
    const session = await auth();
    if (!session?.user) throw new Error('No autorizado');

    // 1. Primero, quitamos el destacado a TODAS las noticias
    // (Asumimos que solo quieres 1 noticia principal gigante)
    await prisma.article.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false }
    });

    // 2. Destacamos la seleccionada
    await prisma.article.update({
        where: { id: articleId },
        data: { isFeatured: true }
    });

    revalidatePath('/');
    revalidatePath('/panel/noticias');
}

// --- CONFIGURACIÓN GLOBAL ---
export async function updateSiteConfig(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const homeCount = Number(formData.get('homeNewsCount'));
    const collageMax = Number(formData.get('maxCollageImages')); // <--- NUEVO

    await prisma.siteConfig.upsert({
        where: { id: 'global' },
        update: { homeNewsCount: homeCount, maxCollageImages: collageMax },
        create: { id: 'global', homeNewsCount: homeCount, maxCollageImages: collageMax },
    });

    revalidatePath('/');
    revalidatePath('/panel/configuracion');
}