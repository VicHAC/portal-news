'use client';

import { updateSection, deleteSection } from '@/app/actions/settings-actions';
import { Trash2, Save } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface Section {
    id: string;
    name: string;
    color: string;
    order: number;
    slug: string;
}

interface Props {
    section: Section;
    isAdmin: boolean; // <--- NUEVA PROP
}

export default function SectionRow({ section, isAdmin }: Props) {
    const formId = `update-form-${section.id}`;

    // --- VISTA SOLO LECTURA (EDITOR) ---
    if (!isAdmin) {
        return (
            <tr className="border-b last:border-0 hover:bg-gray-50 text-sm">
                <td className="p-4 text-center font-mono text-gray-500">{section.order}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <span
                            className="w-6 h-6 rounded-full border shadow-sm"
                            style={{ backgroundColor: section.color }}
                        />
                        <span className="text-gray-500">{section.color}</span>
                    </div>
                </td>
                <td className="p-4 font-medium text-gray-700">{section.name}</td>
                <td className="p-4 text-right text-xs text-gray-400 italic">Solo lectura</td>
            </tr>
        );
    }

    // --- VISTA EDITABLE (ADMIN) ---
    return (
        <tr className="border-b last:border-0 hover:bg-gray-50 transition-colors">
            <td className="hidden">
                <form id={formId} action={updateSection}>
                    <input type="hidden" name="id" value={section.id} />
                </form>
            </td>

            {/* Orden */}
            <td className="p-4">
                <input
                    form={formId}
                    name="order"
                    type="number"
                    defaultValue={section.order}
                    className="w-16 border border-gray-300 p-1 rounded text-center text-sm focus:border-blue-500 outline-none"
                />
            </td>

            {/* Color */}
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <input
                        form={formId}
                        name="color"
                        type="color"
                        defaultValue={section.color}
                        className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                    />
                    <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
                        {section.color}
                    </span>
                </div>
            </td>

            {/* Nombre */}
            <td className="p-4">
                <input
                    form={formId}
                    name="name"
                    type="text"
                    defaultValue={section.name}
                    className="w-full border border-gray-300 p-1 rounded text-sm font-medium text-gray-700 focus:border-blue-500 outline-none"
                />
            </td>

            {/* Acciones */}
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <SaveButton formId={formId} />
                    <form action={deleteSection.bind(null, section.id)}>
                        <button type="submit" className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                            <Trash2 size={18} />
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    );
}

function SaveButton({ formId }: { formId: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            form={formId}
            type="submit"
            disabled={pending}
            className={`p-2 rounded transition ${pending ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                }`}
        >
            <Save size={18} className={pending ? 'animate-pulse' : ''} />
        </button>
    );
}