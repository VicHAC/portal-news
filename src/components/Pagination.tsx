'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            <PaginationArrow
                direction="left"
                href={createPageURL(currentPage - 1)}
                isDisabled={currentPage <= 1}
            />

            <span className="text-sm text-gray-500 font-medium">
                Página {currentPage} de {totalPages}
            </span>

            <PaginationArrow
                direction="right"
                href={createPageURL(currentPage + 1)}
                isDisabled={currentPage >= totalPages}
            />
        </div>
    );
}

function PaginationArrow({
    href,
    direction,
    isDisabled,
}: {
    href: string;
    direction: 'left' | 'right';
    isDisabled?: boolean;
}) {
    const icon = direction === 'left' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />;

    if (isDisabled) {
        return (
            <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-gray-50 text-gray-300 cursor-not-allowed">
                {icon}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className="flex h-9 w-9 items-center justify-center rounded-md border bg-white hover:bg-gray-100 transition"
        >
            {icon}
        </Link>
    );
}