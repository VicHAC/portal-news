'use server';

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function createArticle(formData: FormData) {
    // 1. Verificar seguridad (Solo usuarios logueados pueden publicar)
    const session = await auth();
    if (!session?.user) {
        throw new Error('No autorizado');
    }

    // 2. Obtener datos del formulario
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const section = formData.get('section') as string;
    const imageFile = formData.get('image') as File;
    let summary = formData.get('summary') as string;

    // 3. Generar Slug (URL amigable)
    // Ej: "Mi Noticia" -> "mi-noticia"
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // 4. Autogenerar resumen si está vacío
    if (!summary) {
        // Toma los primeros 160 caracteres del contenido
        summary = content.slice(0, 160) + '...';
    }

    // 5. Subir imagen a Vercel Blob (si existe)
    let mainImageUrl = null;
    if (imageFile && imageFile.size > 0) {
        // 'articles/' es una carpeta virtual para organizar
        const blob = await put(`articles/${slug}-${imageFile.name}`, imageFile, {
            access: 'public',
        });
        mainImageUrl = blob.url;
    }

    // 6. Guardar en Base de Datos
    await prisma.article.create({
        data: {
            title,
            slug,
            content,
            summary,
            section,
            mainImage: mainImageUrl,
            author: session.user.name, // Usamos el nombre del usuario logueado
            published: true, // Publicar directamente (o false si quieres borrador)
        },
    });

    // 7. Actualizar cachés y redirigir
    revalidatePath('/'); // Actualiza el Home
    revalidatePath('/panel'); // Actualiza el Panel
    redirect('/panel');
}

export async function deleteArticle(id: string) {
    // 1. Verificar seguridad
    const session = await auth();
    if (!session?.user) {
        throw new Error('No autorizado');
    }

    // 2. Borrar de la Base de Datos
    await prisma.article.delete({
        where: { id },
    });

    // 3. Actualizar vistas
    revalidatePath('/');
    revalidatePath('/panel/noticias');
}