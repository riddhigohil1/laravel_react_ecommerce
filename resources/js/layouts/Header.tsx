import Navbar from '@/components/Navbar';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Header({ title }: { title: string | null }) {
    const appName = import.meta.env.VITE_APP_NAME;
    const { error, success } = usePage<SharedData>().props;

    const [successMessage, setSuccessMessage] = useState([]);
    const timeOutRef = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>(
        {},
    );

    useEffect(() => {
        if (success.message) {
            const newMessage = {
                ...success,
                id: success.time, // use time as unique identifier
            };

            //Add the new message to the list
            setSuccessMessage((prevMessages): any => [
                newMessage,
                ...prevMessages,
            ]);

            //set a timeout for specific message
            const timeoutId = setTimeout(() => {
                //use a functionl update to ensure the latest state is used
                setSuccessMessage((prevMessages) =>
                    prevMessages.filter((msg: any) => msg.id !== newMessage.id),
                );
                //clear timeout from refs after execution
                delete timeOutRef.current[newMessage.id];
            }, 5000);

            //Store timeout id in the ref
            timeOutRef.current[newMessage.id] = timeoutId;
        }
    }, [success]);

    return (
        <>
            <Head title={title ? title : appName} />
            <Navbar />

            {successMessage.length > 0 && (
                <div className="toast-top toast-end toast z-[1000] mt-16">
                    {successMessage.map((msg: any) => (
                        <div className="alert alert-success" key={msg.id}>
                            <span>{msg.message}</span>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="p-8 text-red-500">
                    <div className="alert alert-error">{error}</div>
                </div>
            )}
        </>
    );
}
