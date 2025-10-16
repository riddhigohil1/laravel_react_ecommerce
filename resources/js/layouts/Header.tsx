import Navbar from '@/components/Navbar';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Header({ title }: { title: string | null }) {
    const appName = import.meta.env.VITE_APP_NAME;
    const { error } = usePage<SharedData>().props;

    return (
        <>
            <Head title={title ? title : appName} />
            <Navbar />

            {error && (
                <div className="p-8 text-red-500">
                    <div className="alert alert-error">{error}</div>
                </div>
            )}
        </>
    );
}
