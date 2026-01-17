'use server';

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// --- ACCIÓN PARA CREAR NOTICIA ---
export async function createArticle(formData: FormData) {
    // 1. VERIFICACIÓN
    const session = await auth();
    if (!session?.user) {
        throw new Error('No autorizado');
    }

    // 2. CONFIGURACIÓN
    const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } });
    const maxCollage = config?.maxCollageImages || 6;

    // 3. PROCESAR DATOS
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const section = formData.get('section') as string;
    const summaryRaw = formData.get('summary') as string;

    // FECHA (Ajuste a mediodía para evitar errores de zona horaria)
    const dateInput = formData.get('date') as string;
    const publishedAt = dateInput ? new Date(`${dateInput}T12:00:00`) : new Date();

    // AUTOR (Si es "Sin crédito", guardamos null)
    const authorSelect = formData.get('author') as string;
    const finalAuthor = authorSelect || null;

    const columnSelect = formData.get('columnName') as string;
    const imageAuthorSelect = formData.get('imageAuthor') as string;

    // SLUG
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const summary = summaryRaw || (content.slice(0, 160) + '...');

    // IMÁGENES
    const mainImageFile = formData.get('image') as File;
    let mainImageUrl = null;
    if (mainImageFile && mainImageFile.size > 0) {
        const blob = await put(`articles/${slug}-main-${mainImageFile.name}`, mainImageFile, { access: 'public' });
        mainImageUrl = blob.url;
    }

    const collageFiles = formData.getAll('collage') as File[];
    let collageUrls: string[] = [];
    if (collageFiles && collageFiles.length > 0) {
        const validFiles = collageFiles.filter(f => f.size > 0);
        if (validFiles.length > maxCollage) validFiles.length = maxCollage;
        const uploadPromises = validFiles.map((file, index) => put(`articles/${slug}-collage-${index}-${file.name}`, file, { access: 'public' }));
        const results = await Promise.all(uploadPromises);
        collageUrls = results.map(r => r.url);
    }

    // 4. GUARDAR EN DB
    await prisma.article.create({
        data: {
            title, slug, content, summary, section,
            mainImage: mainImageUrl,
            imageAuthor: imageAuthorSelect || null,
            collage: collageUrls,
            author: finalAuthor,
            columnName: columnSelect || null,
            published: true,
            publishedAt: publishedAt,
        },
    });

    // 5. REVALIDAR DATOS
    revalidatePath('/');
    revalidatePath('/panel');
    revalidatePath(`/seccion/${section}`);

    // 6. RETORNAR ÉXITO (Sin redirect aquí)
    return { success: true };
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