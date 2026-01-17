'use client';

import { Trash2, Save } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface Props {
    item: { id: string; name: string };
    updateAction: (formData: FormData) => Promise<void>;
    deleteAction: (id: string) => Promise<void>;
    isAdmin: boolean; // <--- NUEVA PROP
}

export default function EditableNameRow({ item, updateAction, deleteAction, isAdmin }: Props) {
    const formId = `update-${item.id}`;

    // VISTA PARA EDITOR (SOLO LECTURA)
    if (!isAdmin) {
        return (
            <tr className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-700">{item.name}</td>
                <td className="p-4 text-right text-xs text-gray-400 italic">Solo lectura</td>
            </tr>
        );
    }

    // VISTA PARA ADMIN (EDITABLE) - (El código anterior)
    return (
        <tr className="border-b last:border-0 hover:bg-gray-50 transition">
            <td className="hidden">
                <form id={formId} action={updateAction}>
                    <input type="hidden" name="id" value={item.id} />
                </form>
            </td>
            <td className="p-4">
                <input
                    form={formId}
                    name="name"
                    defaultValue={item.name}
                    className="w-full border-gray-300 border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </td>
            <td className="p-4 text-right flex justify-end gap-2">
                <SaveButton formId={formId} />
                <form action={async () => await deleteAction(item.id)}>
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                    </button>
                </form>
            </td>
        </tr>
    );
}

function SaveButton({ formId }: { formId: string }) {
    const { pending } = useFormStatus();
    return (
        <button form={formId} disabled={pending} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <Save size={18} className={pending ? 'animate-pulse' : ''} />
        </button>
    );
}