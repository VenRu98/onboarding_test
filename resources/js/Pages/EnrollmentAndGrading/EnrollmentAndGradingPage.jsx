import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function UserPage({ auth, users }) {
    console.log(auth);
    console.log(users);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Enrollment And Grading</h2>}
        >
            <Head title="Enrollment And Grading" />
        </AuthenticatedLayout>
    );
}
