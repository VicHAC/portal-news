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
    // Verificación de seguridad existente...
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const name = formData.get('name') as string;
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-');

    // Capturar Color y Orden
    const color = formData.get('color') as string || '#2563eb'; // Azul default
    const order = Number(formData.get('order')) || 0;

    await prisma.section.create({
        data: { name, slug, color, order }
    });

    revalidatePath('/panel/configuracion/secciones');
    revalidatePath('/'); // Actualizar navbar público
}

// --- ACTUALIZAR SECCIÓN ---
export async function updateSection(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;
    const order = Number(formData.get('order'));

    await prisma.section.update({
        where: { id },
        data: {
            name,
            color,
            order,
            // Opcional: Si quisieras actualizar el slug también:
            // slug: name.toLowerCase().trim().replace(/\s+/g, '-') 
        }
    });

    revalidatePath('/panel/configuracion/secciones');
    revalidatePath('/'); // Para que el Navbar se actualice
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

export async function updateColumn(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;

    await prisma.column.update({ where: { id }, data: { name } });
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

export async function updateAuthor(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const imageFile = formData.get('image') as File;

    // 1. Preparamos los datos a actualizar
    let dataToUpdate: { name: string; image?: string } = { name };

    // 2. Si hay nueva foto, la subimos
    if (imageFile && imageFile.size > 0) {
        // Generamos un nombre único para evitar caché
        const filename = `authors/${id}-${Date.now()}-${imageFile.name}`;
        const blob = await put(filename, imageFile, { access: 'public' });

        dataToUpdate.image = blob.url;
    }

    // 3. Actualizamos en DB
    await prisma.author.update({
        where: { id },
        data: dataToUpdate
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

export async function updateImageAuthor(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;

    await prisma.imageAuthor.update({ where: { id }, data: { name } });
    revalidatePath('/panel/configuracion/autores-imagen');
}

export async function deleteImageAuthor(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('No autorizado');

    await prisma.imageAuthor.delete({ where: { id } });
    revalidatePath('/panel/configuracion/autores-imagen');
}