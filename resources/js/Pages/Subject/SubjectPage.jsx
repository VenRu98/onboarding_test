import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TemplateInputLabel from '@/Components/TempateInputLabel';
import TemplateSelectLabel from '@/Components/TempateSelectLabel';
import InputLabel from '@/Components/InputLabel';

export default function SubjectPage({ auth }) {
    const listSubjectId = usePage().props.subject_ids;
    const [subjects, setSubjects] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalStatus, setModalStatus] = useState(false);
    const [textModal, setTextModal] = useState("");
    const countPerPage = 3;
    const { data, setData, errors, post, put, processing } = useForm({
        id: "",
        subject_id: "",
        subject_name: "",
        credit: "",
        subject_pre_required: "",
    });
    const getSubjectList = () => {
        setLoading(true);
        axios.post(route('subject.get_all_data'),
            {
                sort: sort,
                page: page,
                per_page: countPerPage
            })
            .then(res => {
                setSubjects(res.data);
            }).catch(err => {
                setSubjects({});
            }).finally(() => setLoading(false));
    }
    useEffect(() => {
        getSubjectList();
    }, [page, sort]);

    const showAddSubject = () => {
        setModalStatus(true);
        setTextModal("Add");
    }

    const showEditSubject = (event) => {
        setTextModal("Edit");
        axios.get(route("subject.show", event.currentTarget.id))
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
        axios.get(route("subject.show", event.currentTarget.id))
            .then(res => {
                res = res.data;
                data.id = res.id;
                setModalStatus(true);
            });
    }

    const addSubject = (e) => {
        e.preventDefault();
        post(route('subject.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                getSubjectList();
            },
            onError: (e) => {
                errors.subject_id = e.subject_id ?? "";
                errors.subject_name = e.subject_name ?? "";
                errors.credit = e.credit ?? "";
                errors.subject_pre_required = e.subject_pre_required ?? "";
            },
        })
    };
    const editSubject = (e) => {
        e.preventDefault();
        put(route("subject.update", data.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                getSubjectList();
            },
            onError: (e) => {
                errors.subject_id = e.subject_id ?? "";
                errors.subject_name = e.subject_name ?? "";
                errors.credit = e.credit ?? "";
                errors.subject_pre_required = e.subject_pre_required ?? "";
            },
        })
    };
    const deleteSubject = (e) => {
        e.preventDefault();
        axios.delete(route('subject.destroy', data.id))
            .then(res => {
                closeModal();
                getSubjectList();
            },)
            .catch((e) => { console.log(e) })
            .finally(() => clearForm());

    };
    const closeModal = () => {
        setModalStatus(false);
        clearForm();
    };
    const clearForm = () => {
        errors.subject_id = "";
        errors.subject_name = "";
        errors.credit = "";
        errors.subject_pre_required = "";
        data.subject_id = "";
        data.subject_name = "";
        data.credit = "";
        data.subject_pre_required = "";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subject</h2>}
            children={
                <div className="bg-white grid justify-items-stretch max-w-7xl mx-auto my-4">
                    <div className='justify-self-end m-4'>
                        <button className="btn btn-primary" onClick={showAddSubject}>Add</button>
                    </div>
                    <DataTable
                        columns={[
                            {
                                name: 'Subject ID',
                                selector: (row, i) => row.subject_id,
                                sortable: true,
                                sortField: 'subject_id',
                            },
                            {
                                name: 'Subject Name',
                                selector: (row, i) => row.subject_name,
                                sortable: true,
                                sortField: 'subject_name',
                            },
                            {
                                name: 'Credit',
                                selector: (row, i) => row.credit,
                                sortable: true,
                                sortField: 'credit',
                            },
                            {
                                name: 'Subject Per Required',
                                selector: (row, i) => row.subject_pre_required,
                                sortable: true,
                                sortField: 'subject_per_required',
                            },
                            {
                                name: 'Action',
                                cell: (row) =>
                                    <>
                                        <button className='btn bg-warning' onClick={showEditSubject} id={row.id}>Edit</button>
                                        <button className='btn bg-error' onClick={showDeleteSubject} id={row.id}>Delete</button>
                                    </>,
                            }]
                        }
                        data={subjects.data}
                        highlightOnHover
                        progressPending={loading}
                        sortServer
                        onSort={(sort, direction) => {
                            sort.direction = direction;
                            setSort(sort);
                        }}
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
                                    <>
                                        <TemplateInputLabel
                                            id={"subject_id"}
                                            title={"Subject ID"}
                                            handle={(e) => setData("subject_id", e.target.value)}
                                            errors={errors.subject_id}
                                            value={data.subject_id}
                                        ></TemplateInputLabel>
                                        <TemplateInputLabel
                                            id={"subject_name"}
                                            title={"Subject Name"}
                                            handle={(e) => setData("subject_name", e.target.value)}
                                            errors={errors.subject_name}
                                            value={data.subject_name}
                                        ></TemplateInputLabel>
                                        <TemplateInputLabel
                                            id={"credit"}
                                            title={"Credit"}
                                            handle={(e) => setData("credit", e.target.value)}
                                            errors={errors.credit}
                                            value={data.credit}
                                        ></TemplateInputLabel>
                                        <TemplateSelectLabel
                                            list={listSubjectId}
                                            id={"subject_pre_required"}
                                            title={"Subject Pre Required"}
                                            handle={(e) => setData("subject_pre_required", e.target.value)}
                                            errors={errors.subject_pre_required}
                                            selected={data.subject_pre_required}
                                            self={data.subject_id}
                                        ></TemplateSelectLabel>
                                    </>
                            }
                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                <PrimaryButton className="ml-3" disabled={processing}>
                                    {textModal} Subject
                                </PrimaryButton>
                            </div>
                        </form>
                    </Modal>
                </div>
            }
        >
        </AuthenticatedLayout>
    );
}
