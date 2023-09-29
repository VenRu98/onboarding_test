import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TemplateInputLabel from '@/Components/TempateInputLabel';
import TemplateSelectLabel from '@/Components/TempateSelectLabel';
import InputLabel from '@/Components/InputLabel';

export default function MasterStudentPage({ auth }) {
    const [students, setStudents] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalStatus, setModalStatus] = useState(false);
    const [textModal, setTextModal] = useState("");
    const countPerPage = 3;
    const { data, setData, errors, post, put, processing } = useForm({
        id: "",
        student_id: "",
        student_name: "",
        date_of_birth: "",
        year_entrance: "",
    });
    const getStudentList = () => {
        setLoading(true);
        axios.post(route('student.get_all_data'),
            {
                sort: sort,
                page: page,
                per_page: countPerPage
            })
            .then(res => {
                setStudents(res.data);
            }).catch(err => {
                setStudents({});
            }).finally(() => setLoading(false));
    }
    useEffect(() => {
        getStudentList();
    }, [page, sort]);

    const showAddSubject = () => {
        setModalStatus(true);
        setTextModal("Add");
    }

    const showEditSubject = (event) => {
        setTextModal("Edit");
        axios.get(route("student.show", event.currentTarget.id))
            .then(res => {
                res = res.data;
                data.id = res.id;
                data.student_id = res.student_id;
                data.student_name = res.student_name;
                data.date_of_birth = res.date_of_birth;
                data.year_entrance = res.year_entrance;
                setModalStatus(true);
            });
    }
    const showDeleteSubject = (event) => {
        setTextModal("Delete");
        axios.get(route("student.show", event.currentTarget.id))
            .then(res => {
                res = res.data;
                data.id = res.id;
                setModalStatus(true);
            });
    }

    const addSubject = (e) => {
        e.preventDefault();
        post(route('student.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                getStudentList();
            },
            onError: (e) => {
                errors.student_id = e.student_id ?? "";
                errors.student_name = e.student_name ?? "";
                errors.date_of_birth = e.date_of_birth ?? "";
                errors.year_entrance = e.year_entrance ?? "";
            },
        })
    };
    const editSubject = (e) => {
        e.preventDefault();
        put(route("student.update", data.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                getStudentList();
            },
            onError: (e) => {
                errors.student_id = e.student_id ?? "";
                errors.student_name = e.student_name ?? "";
                errors.date_of_birth = e.date_of_birth ?? "";
                errors.year_entrance = e.year_entrance ?? "";
            },
        })
    };
    const deleteSubject = (e) => {
        e.preventDefault();
        axios.delete(route('student.destroy', data.id))
            .then(res => {
                closeModal();
                getStudentList();
            },)
            .catch((e) => { console.log(e) })
            .finally(() => clearForm());

    };
    const closeModal = () => {
        setModalStatus(false);
        clearForm();
    };
    const clearForm = () => {
        errors.student_id = "";
        errors.student_name = "";
        errors.date_of_birth = "";
        errors.year_entrance = "";
        data.student_id = "";
        data.student_name = "";
        data.date_of_birth = "";
        data.year_entrance = "";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Master Student</h2>}
            children={
                <div className="bg-white grid justify-items-stretch max-w-7xl mx-auto my-4">
                    <div className='justify-self-end m-4'>
                        <button className="btn btn-primary" onClick={showAddSubject}>Add</button>
                    </div>
                    <DataTable
                        columns={[
                            {
                                name: 'Student Id',
                                selector: (row, i) => row.student_id,
                                sortable: true,
                                sortField: 'student_id',
                            },
                            {
                                name: 'Student Name',
                                selector: (row, i) => row.student_name,
                                sortable: true,
                                sortField: 'student_name',
                            },
                            {
                                name: 'Date Of Birth',
                                selector: (row, i) => row.date_of_birth,
                                sortable: true,
                                sortField: 'date_of_birth',
                            },
                            {
                                name: 'Year Entrance',
                                selector: (row, i) => row.year_entrance,
                                sortable: true,
                                sortField: 'year_entrance',
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
                        data={students.data}
                        highlightOnHover
                        progressPending={loading}
                        sortServer
                        onSort={(sort, direction) => {
                            sort.direction = direction;
                            setSort(sort);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={students.total}
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
                                {textModal} Master Student
                            </h2>
                            {
                                textModal == "Delete"
                                    ? <InputLabel htmlFor={""} value={"Apakah kamu yakin untuk menghapus ini?"} />
                                    :
                                    <>
                                        <TemplateInputLabel
                                            id={"student_id"}
                                            title={"Student Id"}
                                            handle={(e) => setData("student_id", e.target.value)}
                                            errors={errors.student_id}
                                            value={data.student_id}
                                        ></TemplateInputLabel>
                                        <TemplateInputLabel
                                            id={"student_name"}
                                            title={"Student Name"}
                                            handle={(e) => setData("student_name", e.target.value)}
                                            errors={errors.student_name}
                                            value={data.student_name}
                                        ></TemplateInputLabel>
                                        <TemplateInputLabel
                                            id={"date_of_birth"}
                                            title={"Date Of Birth"}
                                            type='date'
                                            handle={(e) => setData("date_of_birth", e.target.value)}
                                            errors={errors.date_of_birth}
                                            value={data.date_of_birth}
                                        ></TemplateInputLabel>
                                        <TemplateInputLabel
                                            id={"year_entrance"}
                                            title={"Year Entrance"}
                                            type='number'
                                            handle={(e) => setData("year_entrance", e.target.value)}
                                            errors={errors.year_entrance}
                                            value={data.year_entrance}
                                        ></TemplateInputLabel>
                                    </>
                            }
                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                <PrimaryButton className="ml-3" disabled={processing}>
                                    {textModal} Master Student
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
