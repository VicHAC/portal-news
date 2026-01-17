'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { auth } from '@/auth';
import { hash } from 'bcryptjs';

// ==========================================
// 1. CONFIGURACIÓN GLOBAL
// ==========================================
export async function updateSiteConfig(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const homeNewsCount = parseInt(formData.get('homeNewsCount') as string) || 10;
    const maxCollageImages = parseInt(formData.get('maxCollageImages') as string) || 6;

    const logoFile = formData.get('logo') as File;
    let newLogoUrl = undefined;

    if (logoFile && logoFile.size > 0) {
        const blob = await put(`site-logo-${Date.now()}-${logoFile.name}`, logoFile, { access: 'public' });
        newLogoUrl = blob.url;
    }

    await prisma.siteConfig.upsert({
        where: { id: 'global' },
        update: {
            homeNewsCount,
            maxCollageImages,
            ...(newLogoUrl && { logoUrl: newLogoUrl }),
        },
        create: {
            id: 'global',
            homeNewsCount,
            maxCollageImages,
            logoUrl: newLogoUrl || null,
        },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/panel/configuracion');
}

// ==========================================
// 2. SECCIONES
// ==========================================
export async function createSection(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const name = formData.get('name') as string;
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const color = formData.get('color') as string || '#2563eb';
    const order = parseInt(formData.get('order') as string) || 0;

    await prisma.section.create({ data: { name, slug, color, order } });
    revalidatePath('/panel/configuracion');
    revalidatePath('/', 'layout');
}

export async function updateSection(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const color = formData.get('color') as string;
    const order = parseInt(formData.get('order') as string);

    await prisma.section.update({ where: { id }, data: { name, slug, color, order } });
    revalidatePath('/panel/configuracion');
    revalidatePath('/', 'layout');
}

export async function deleteSection(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    await prisma.section.delete({ where: { id } });
    revalidatePath('/panel/configuracion');
    revalidatePath('/', 'layout');
}

// ==========================================
// 3. AUTORES (REDACTORES)
// ==========================================
export async function createAuthor(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const name = formData.get('name') as string;
    const imageFile = formData.get('image') as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        const blob = await put(`authors/${imageFile.name}`, imageFile, { access: 'public' });
        imageUrl = blob.url;
    }

    await prisma.author.create({ data: { name, image: imageUrl } });
    revalidatePath('/panel/configuracion');
}

export async function updateAuthor(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const imageFile = formData.get('image') as File;
    let imageUrl = undefined;

    if (imageFile && imageFile.size > 0) {
        const blob = await put(`authors/${imageFile.name}`, imageFile, { access: 'public' });
        imageUrl = blob.url;
    }

    await prisma.author.update({
        where: { id },
        data: { name, ...(imageUrl && { image: imageUrl }) },
    });
    revalidatePath('/panel/configuracion');
}

export async function deleteAuthor(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    await prisma.author.delete({ where: { id } });
    revalidatePath('/panel/configuracion');
}

// ==========================================
// 4. COLUMNAS
// ==========================================
export async function createColumn(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const name = formData.get('name') as string;
    await prisma.column.create({ data: { name } });
    revalidatePath('/panel/configuracion');
}

export async function updateColumn(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;

    await prisma.column.update({ where: { id }, data: { name } });
    revalidatePath('/panel/configuracion');
}

export async function deleteColumn(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    await prisma.column.delete({ where: { id } });
    revalidatePath('/panel/configuracion');
}

// ==========================================
// 5. FOTÓGRAFOS
// ==========================================
export async function createImageAuthor(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const name = formData.get('name') as string;
    await prisma.imageAuthor.create({ data: { name } });
    revalidatePath('/panel/configuracion');
}

export async function updateImageAuthor(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;

    await prisma.imageAuthor.update({ where: { id }, data: { name } });
    revalidatePath('/panel/configuracion');
}

export async function deleteImageAuthor(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    await prisma.imageAuthor.delete({ where: { id } });
    revalidatePath('/panel/configuracion');
}

// ==========================================
// 6. USUARIOS (LOGIN CON USERNAME)
// ==========================================
export async function createUser(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const name = formData.get('name') as string;
    const username = formData.get('username') as string; // Leemos username
    const password = formData.get('password') as string;
    const roleInput = formData.get('role') as string; // Viene como string del select

    // Verificar si ya existe
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
        throw new Error('El nombre de usuario ya existe');
    }

    // Encriptar contraseña
    const hashedPassword = await hash(password, 10);

    // Crear usuario (Prisma convertirá el string 'ADMIN' al Enum ADMIN automáticamente)
    await prisma.user.create({
        data: {
            name,
            username,
            password: hashedPassword,
            role: roleInput === 'ADMIN' ? 'ADMIN' : 'EDITOR',
        },
    });

    revalidatePath('/panel/configuracion/usuarios');
}

export async function deleteUser(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    if (session.user.id === id) {
        throw new Error('No puedes eliminar tu propio usuario.');
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath('/panel/configuracion/usuarios');
}