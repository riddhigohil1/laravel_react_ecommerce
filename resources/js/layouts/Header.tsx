import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';

export default function Header({ title }: { title: string | null }) {
    const appName = import.meta.env.VITE_APP_NAME;

    return (
        <>
            <Head title={title ? title : appName} />
            <Navbar />
        </>
    );
}
