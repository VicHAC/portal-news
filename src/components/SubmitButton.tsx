'use client';

import { useFormStatus } from 'react-dom';
import { Save, Loader2 } from 'lucide-react';

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    Subiendo...
                </>
            ) : (
                <>
                    <Save size={20} />
                    Guardar Cambios
                </>
            )}
        </button>
    );
}