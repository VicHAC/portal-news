'use client';

import { usePathname } from 'next/navigation';

export default function NavbarVisibility({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Si la ruta comienza con "/panel", NO mostramos nada (return null)
    if (pathname.startsWith('/panel')) {
        return null;
    }

    // En cualquier otra ruta, mostramos el Navbar (children)
    return <>{children}</>;
}