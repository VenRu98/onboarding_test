import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TemplateInputLabel from '@/Components/TempateInputLabel';
import TemplateSelectLabel from '@/Components/TempateSelectLabel';
import InputLabel from '@/Components/InputLabel';


export default function UserPage({ auth }) {
    const [subjects, setSubjects] = useState({});
    const [page, setPage] = useState(1);

    const [modalStatus, setModalStatus] = useState(false);
    const [modalDeleteStatus, setModalDeleteStatus] = useState(false);
    const [textModal, setTextModal] = useState("");

    const countPerPage = 3;
    const { data, setData, errors, post, reset, processing } = useForm({
        id: "",
        subject_id: "",
        subject_name: "",
        credit: "",
        subject_pre_required: "",
    });
    const getSubjectList = () => {
        axios.post(`/subject/get_all_data`,
            {
                page: page,
                per_page: countPerPage,
                delay: 1
            }
        )
            .then(res => {
                setSubjects(res.data);
            }).catch(err => {
                setSubjects({});
            });
    }
    useEffect(() => {
        getSubjectList();
    }, [page]);

    const showAddSubject = () => {
        data.subject_id = "";
        data.subject_name = "";
        data.credit = "";
        data.subject_pre_required = "";
        setModalStatus(true);
        setTextModal("Add");
    }

    const showEditSubject = (event) => {

        setTextModal("Edit");
        axios.get(`/subject/${event.currentTarget.id}`)
            .then(res => {
                res = res.data;
                data.id = res.id;
                data.subject_id = res.subject_id;
                data.subject_name = res.subject_name;
                data.credit = res.credit;
                data.subject_pre_required = res.subject_pre_required;
                setModalStatus(true);
            });
    }
    const showDeleteSubject = (event) => {
        setTextModal("Delete");
        axios.get(`/subject/${event.currentTarget.id}`)
            .then(res => {
                res = res.data;
                data.id = res.id;
                setModalStatus(true);
            });
        setModalStatus(true);
    }

    const addSubject = (e) => {
        e.preventDefault();
        post(route('subject.store'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: (e) => console.log(e),
            onFinish: () => reset(),
        })
        getSubjectList();
    };
    const editSubject = (e) => {
        e.preventDefault();
        axios.put(`/subject/${data.id}`, data)
            .then(res => closeModal(),)
            .catch((e) => { console.log(e) })
            .finally(() => reset());
        getSubjectList();
    };
    const deleteSubject = (e) => {
        e.preventDefault();
        axios.delete(`/subject/${data.id}`)
            .then(res => closeModal(),)
            .catch((e) => { console.log(e) })
            .finally(() => reset());
        getSubjectList();
    };
    const closeModal = () => {
        setModalStatus(false);
        reset();
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subject</h2>}
        >
            <div className="bg-white grid justify-items-stretch ">
                <div className='justify-self-end m-4'>
                    <button className="btn btn-primary" onClick={showAddSubject}>Add</button>
                </div>
            </div>
            <DataTable
                actions
                columns={
                    [
                        {
                            name: 'Subject ID',
                            selector: (row, i) => row.subject_id,
                        },
                        {
                            name: 'Subject Name',
                            selector: (row, i) => row.subject_name,
                        },
                        {
                            name: 'Credit',
                            selector: (row, i) => row.credit,
                        },
                        {
                            name: 'Subject Per Required',
                            selector: (row, i) => row.subject_pre_required,
                        },
                        {
                            name: 'Action',
                            cell: (row) =>
                                <>
                                    <button className='btn bg-warning' onClick={showEditSubject} id={row.id}>Edit</button>
                                    <button className='btn bg-error' onClick={showDeleteSubject} id={row.id}>Delete</button>
                                </>,
                        },

                    ]
                }
                data={subjects.data}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={subjects.total}
                paginationPerPage={countPerPage}
                paginationComponentOptions={{
                    noRowsPerPage: true
                }}

                onChangePage={page => setPage(page)}
            />

            <Modal show={modalStatus} onClose={closeModal}>
                <form onSubmit={textModal == "Add"
                    ? addSubject : textModal == "Edit"
                        ? editSubject : deleteSubject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {textModal} Subject
                    </h2>
                    {
                        textModal == "Delete"
                            ? <InputLabel htmlFor={""} value={"Apakah kamu yakin untuk menghapus ini?"} />
                            :
                            <><TemplateInputLabel
                                required
                                id={"subject_id"}
                                title={"Subject ID"}
                                value={data.subject_id}
                                handle={(e) => setData("subject_id", e.target.value)}
                            ></TemplateInputLabel><TemplateInputLabel
                                required
                                id={"subject_name"}
                                title={"Subject Name"}
                                value={data.subject_name}
                                handle={(e) => setData("subject_name", e.target.value)}
                            ></TemplateInputLabel><TemplateInputLabel
                                required
                                id={"credit"}
                                title={"Credit"}
                                value={data.credit}
                                handle={(e) => setData("credit", e.target.value)}
                            ></TemplateInputLabel><TemplateSelectLabel
                                id={"subject_pre_required"}
                                title={"Subject Pre Required"}
                                handle={(e) => setData("subject_pre_required", e.target.value)}
                                selected={data.subject_pre_required}
                                self={data.subject_id}
                            ></TemplateSelectLabel></>
                    }


                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <PrimaryButton className="ml-3" disabled={processing}>
                            {textModal} Subject
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>

    );
}
