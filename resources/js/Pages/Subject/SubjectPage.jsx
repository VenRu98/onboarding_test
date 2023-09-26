import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const columns = [
    {
        name: 'Subject ID',
        selector: "subject_id",
    },
    {
        name: 'Subject Name',
        selector: "subject_name",
    },
    {
        name: 'Credit',
        selector: "credit",
    },
    {
        name: 'Subject Per Required',
        selector: "subject_pre_required",
    }
];

export default function UserPage({ auth }) {

    const [subjects, setSubjects] = useState({});
    const [page, setPage] = useState(1);
    // const countPerPage = 3;

    const getSubjectList = () => {
        axios.get(`/subject/get_all_data?page=${page}&per_page=${countPerPage}&delay=1`).then(res => {
            setSubjects(res.data);
        }).catch(err => {
            setSubjects({});
        });
    }

    useEffect(() => {
        getSubjectList();
    }, [page]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subject</h2>}
        >
            <Head title="Subject" />
            {/* <DataTable
                title="Subject"
                columns={columns}
                data={users.data}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={users.total}
                paginationPerPage={countPerPage}
                paginationComponentOptions={{
                    noRowsPerPage: true
                }}
                onChangePage={page => setPage(page)}
            /> */}
        </AuthenticatedLayout>

    );
}
