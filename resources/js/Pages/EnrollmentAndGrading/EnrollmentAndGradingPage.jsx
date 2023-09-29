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

export default function EnrollmentAndGradingPage({ auth }) {
    const listSubjectId = usePage().props.subject_ids;
    const listStudentId = usePage().props.student_ids;
    const [subjects, setEnrollments] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalStatus, setModalStatus] = useState(false);
    const [textModal, setTextModal] = useState("");
    const countPerPage = 3;
    const { data, setData, errors, post, put, processing } = useForm({
        id: "",
        subject_id: "",
        student_id: "",
        enroll_start_date: "",
        enroll_end_date: "",
        status: "",
        grade: "",
    });
    const getEnrollmentAndGradingList = () => {
        setLoading(true);
        axios.post(route('enrollment_and_grading.get_all_data'),
            {
                sort: sort,
                page: page,
                per_page: countPerPage
            })
            .then(res => {
                setEnrollments(res.data);
            }).catch(err => {
                setEnrollments({});
            }).finally(() => setLoading(false));
    }
    useEffect(() => {
        getEnrollmentAndGradingList();
    }, [page, sort]);

    const showAddEnrollment = () => {
        setModalStatus(true);
        setTextModal("Add");
    }

    const showEditEnrollment = (event) => {
        setTextModal("Edit");
        axios.get(route("enrollment_and_grading.show", event.currentTarget.id))
            .then(res => {
                res = res.data;
                data.id = res.id;
                data.subject_id = res.subject_id;
                data.student_id = res.student_id;
                data.enroll_start_date = res.enroll_start_date;
                data.enroll_end_date = res.enroll_end_date;
                data.status = res.status;
                data.grade = res.grade;
                setModalStatus(true);
            });
    }
    const showDeleteEnrollment = (event) => {
        setTextModal("Delete");
        axios.get(route("enrollment_and_grading.show", event.currentTarget.id))
            .then(res => {
                res = res.data;
                data.id = res.id;
                setModalStatus(true);
            });
    }

    const addEnrollment = (e) => {
        e.preventDefault();
        post(route('enrollment_and_grading.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                getEnrollmentAndGradingList();
            },
            onError: (e) => {
                errors.subject_id = e.subject_id ?? "";
                errors.student_id = e.student_id ?? "";
                errors.enroll_start_date = e.enroll_start_date ?? "";
                errors.enroll_end_date = e.enroll_end_date ?? "";
                errors.status = e.status ?? "";
                errors.grade = e.grade ?? "";
            },
        })
    };
    const editEnrollment = (e) => {
        e.preventDefault();
        put(route("enrollment_and_grading.update", data.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                getEnrollmentAndGradingList();
            },
            onError: (e) => {
                errors.subject_id = e.subject_id ?? "";
                errors.student_id = e.student_id ?? "";
                errors.enroll_start_date = e.enroll_start_date ?? "";
                errors.enroll_end_date = e.enroll_end_date ?? "";
                errors.status = e.status ?? "";
                errors.grade = e.grade ?? "";
            },
        })
    };
    const deleteEnrollment = (e) => {
        e.preventDefault();
        axios.delete(route('enrollment_and_grading.destroy', data.id))
            .then(res => {
                closeModal();
                getEnrollmentAndGradingList();
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
        errors.student_id = "";
        errors.enroll_start_date = "";
        errors.enroll_end_date = "";
        errors.status = "";
        errors.grade = "";
        data.subject_id = "";
        data.student_id = "";
        data.enroll_start_date = "";
        data.enroll_end_date = "";
        data.status = "";
        data.grade = "";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Enrollment And Grading</h2>}
            children={
                <div className="bg-white grid justify-items-stretch max-w-7xl mx-auto my-4">
                    <div className='justify-self-end m-4'>
                        <button className="btn btn-primary" onClick={showAddEnrollment}>Add</button>
                    </div>
                    <DataTable
                        columns={[
                            {
                                name: 'Subject Id',
                                selector: (row, i) => row.subject_id,
                                sortable: true,
                                sortField: 'subject_id',
                            },
                            {
                                name: 'Student Id',
                                selector: (row, i) => row.student_id,
                                sortable: true,
                                sortField: 'student_id',
                            },
                            {
                                name: 'Enroll Start Date',
                                selector: (row, i) => row.enroll_start_date,
                                sortable: true,
                                sortField: 'enroll_start_date',
                            },
                            {
                                name: 'Enroll End Date',
                                selector: (row, i) => row.enroll_end_date,
                                sortable: true,
                                sortField: 'enroll_end_date',
                            },
                            {
                                name: 'Status',
                                selector: (row, i) => row.status,
                                sortable: true,
                                sortField: 'status',
                            },
                            {
                                name: 'Grade',
                                selector: (row, i) => row.grade,
                                sortable: true,
                                sortField: 'grade',
                            },
                            {
                                name: 'Action',
                                cell: (row) =>
                                    <>
                                        <button className='btn bg-warning' onClick={showEditEnrollment} id={row.id}>Edit</button>
                                        <button className='btn bg-error' onClick={showDeleteEnrollment} id={row.id}>Delete</button>
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
                            ? addEnrollment : textModal == "Edit"
                                ? editEnrollment : deleteEnrollment} className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                {textModal} Enrollment
                            </h2>
                            {
                                textModal == "Delete"
                                    ? <InputLabel htmlFor={""} value={"Apakah kamu yakin untuk menghapus ini?"} />
                                    :
                                    <>
                                        <TemplateSelectLabel
                                            list={listSubjectId}
                                            id={"subject_id"}
                                            title={"Subject ID"}
                                            handle={(e) => setData("subject_id", e.target.value)}
                                            errors={errors.subject_id}
                                            selected={data.subject_id}
                                        ></TemplateSelectLabel>
                                        <TemplateSelectLabel
                                            list={listStudentId}
                                            id={"student_id"}
                                            title={"Student ID"}
                                            handle={(e) => setData("student_id", e.target.value)}
                                            errors={errors.student_id}
                                            selected={data.student_id}
                                        ></TemplateSelectLabel>
                                        <TemplateInputLabel
                                            type='date'
                                            id={"enroll_start_date"}
                                            title={"Enrollment Start Date"}
                                            handle={(e) => setData("enroll_start_date", e.target.value)}
                                            errors={errors.enroll_start_date}
                                            value={data.enroll_start_date}
                                        ></TemplateInputLabel>
                                        <TemplateInputLabel
                                            type='date'
                                            id={"enroll_end_date"}
                                            title={"Enrollment End Date"}
                                            handle={(e) => setData("enroll_end_date", e.target.value)}
                                            errors={errors.enroll_end_date}
                                            value={data.enroll_end_date}
                                        ></TemplateInputLabel>
                                        <TemplateSelectLabel
                                            list={["Fail", "Passed"]}
                                            id={"status"}
                                            title={"Status"}
                                            handle={(e) => setData("status", e.target.value)}
                                            errors={errors.status}
                                            selected={data.status}
                                        ></TemplateSelectLabel>
                                        <TemplateSelectLabel
                                            list={["A", "B", "C", "D", "E", "F"]}
                                            id={"grade"}
                                            title={"Grade"}
                                            handle={(e) => setData("grade", e.target.value)}
                                            errors={errors.grade}
                                            selected={data.grade}
                                        ></TemplateSelectLabel>
                                    </>
                            }
                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                <PrimaryButton className="ml-3" disabled={processing}>
                                    {textModal} Enrollment
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
