'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { hash } from 'bcryptjs';
import { put } from '@vercel/blob';

// --- MIDDLEWARE DE SEGURIDAD ---
async function requireAdmin() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error('Permiso denegado: Solo administradores.');
    }
}

// --- 1. GESTIÓN DE SECCIONES ---
export async function createSection(formData: FormData) {
    await requireAdmin();
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-');

    await prisma.section.create({ data: { name, slug } });
    revalidatePath('/panel/configuracion/secciones');
}

export async function deleteSection(id: string) {
    await requireAdmin();
    await prisma.section.delete({ where: { id } });
    revalidatePath('/panel/configuracion/secciones');
}

// --- 2. GESTIÓN DE USUARIOS ---
export async function createUser(formData: FormData) {
    await requireAdmin();
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const passwordRaw = formData.get('password') as string;
    const role = formData.get('role') as 'ADMIN' | 'EDITOR';

    const password = await hash(passwordRaw, 10);

    await prisma.user.create({
        data: { name, username, password, role }
    });
    revalidatePath('/panel/configuracion/usuarios');
}

export async function deleteUser(id: string) {
    await requireAdmin();
    // Evitar que se borre a sí mismo podría ser una mejora, pero por ahora simple:
    await prisma.user.delete({ where: { id } });
    revalidatePath('/panel/configuracion/usuarios');
}

// --- 3. GESTIÓN DE COLUMNAS ---
export async function createColumn(formData: FormData) {
    await requireAdmin();
    const name = formData.get('name') as string;

    await prisma.column.create({ data: { name } });
    revalidatePath('/panel/configuracion/columnas');
}

export async function deleteColumn(id: string) {
    await requireAdmin();
    await prisma.column.delete({ where: { id } });
    revalidatePath('/panel/configuracion/columnas');
}

// --- 4. GESTIÓN DE AUTORES (Con Foto) ---
export async function createAuthor(formData: FormData) {
    await requireAdmin();
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const imageFile = formData.get('image') as File;

    let imageUrl = null;

    // Subir foto si existe
    if (imageFile && imageFile.size > 0) {
        const blob = await put(`authors/${imageFile.name}`, imageFile, {
            access: 'public',
        });
        imageUrl = blob.url;
    }

    await prisma.author.create({
        data: { name, bio, image: imageUrl }
    });
    revalidatePath('/panel/configuracion/autores');
}

export async function deleteAuthor(id: string) {
    await requireAdmin();
    await prisma.author.delete({ where: { id } });
    revalidatePath('/panel/configuracion/autores');
}

// --- 5. GESTIÓN DE AUTORES DE IMAGEN (FOTÓGRAFOS) ---
export async function createImageAuthor(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const name = formData.get('name') as string;
    await prisma.imageAuthor.create({ data: { name } });
    revalidatePath('/panel/configuracion/autores-imagen');
}

export async function deleteImageAuthor(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    await prisma.imageAuthor.delete({ where: { id } });
    revalidatePath('/panel/configuracion/autores-imagen');
}