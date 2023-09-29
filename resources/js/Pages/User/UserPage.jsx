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
import TemplateSwitchLabel from '@/Components/TempateSwitchLabel';

export default function UserPage({ auth }) {
    const [users, setUsers] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalStatus, setModalStatus] = useState(false);
    const [textModal, setTextModal] = useState("");
    const countPerPage = 3;
    const { data, setData, errors, post, put, processing } = useForm({
        id: "",
        user_id: "",
        name: "",
        password: "",
        flag_active: false,
    });
    const getUserList = () => {
        setLoading(true);
        axios.post(route('user.get_all_data'),
            {
                sort: sort,
                page: page,
                per_page: countPerPage
            })
            .then(res => {
                setUsers(res.data);
            }).catch(err => {
                setUsers({});
            }).finally(() => setLoading(false));
    }
    useEffect(() => {
        getUserList();
    }, [page, sort]);

    const showAddSubject = () => {
        setModalStatus(true);
        setTextModal("Add");
    }

    const showEditSubject = (event) => {
        setTextModal("Edit");
        axios.get(route("user.show", event.currentTarget.id))
            .then(res => {
                res = res.data;
                data.id = res.id;
                data.user_id = res.user_id;
                data.name = res.name;
                data.password = res.password;
                data.flag_active = res.flag_active;
                setModalStatus(true);
            });
    }
    const showDeleteSubject = (event) => {
        setTextModal("Delete");
        axios.get(route("user.show", event.currentTarget.id))
            .then(res => {
                res = res.data;
                data.id = res.id;
                setModalStatus(true);
            });
    }

    const addSubject = (e) => {
        e.preventDefault();
        post(route('user.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                getUserList();
            },
            onError: (e) => {
                errors.user_id = e.user_id ?? "";
                errors.name = e.name ?? "";
                errors.password = e.password ?? "";
                errors.flag_active = e.flag_active ?? "";
            },
        })
    };
    const editSubject = (e) => {
        e.preventDefault();
        put(route("user.update", data.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                getUserList();
            },
            onError: (e) => {
                errors.user_id = e.user_id ?? "";
                errors.name = e.name ?? "";
                errors.password = e.password ?? "";
                errors.flag_active = e.flag_active ?? "";
            },
        })
    };
    const deleteSubject = (e) => {
        e.preventDefault();
        axios.delete(route('user.destroy', data.id))
            .then(res => {
                closeModal();
                getUserList();
            },)
            .catch((e) => { console.log(e) })
            .finally(() => clearForm());

    };
    const closeModal = () => {
        setModalStatus(false);
        clearForm();
    };
    const clearForm = () => {
        errors.user_id = "";
        errors.name = "";
        errors.password = "";
        errors.flag_active = false;
        data.user_id = "";
        data.name = "";
        data.password = "";
        data.flag_active = false;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User</h2>}
            children={
                <div className="bg-white grid justify-items-stretch max-w-7xl mx-auto my-4">
                    <div className='justify-self-end m-4'>
                        <button className="btn btn-primary" onClick={showAddSubject}>Add</button>
                    </div>
                    <DataTable
                        columns={[
                            {
                                name: 'User Id',
                                selector: (row, i) => row.user_id,
                                sortable: true,
                                sortField: 'user_id',
                            },
                            {
                                name: 'Name',
                                selector: (row, i) => row.name,
                                sortable: true,
                                sortField: 'name',
                            },
                            {
                                name: 'Flag Active',
                                selector: (row, i) => row.flag_active == 1 ? "Active" : "Non Active",
                                sortable: true,
                                sortField: 'flag_active',
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
                        data={users.data}
                        highlightOnHover
                        progressPending={loading}
                        sortServer
                        onSort={(sort, direction) => {
                            sort.direction = direction;
                            setSort(sort);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={users.total}
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
                                {textModal} User
                            </h2>
                            {
                                textModal == "Delete"
                                    ? <InputLabel htmlFor={""} value={"Apakah kamu yakin untuk menghapus ini?"} />
                                    :
                                    <>
                                        <TemplateInputLabel
                                            readOnly={textModal == "Edit"}
                                            id={"user_id"}
                                            title={"User Id"}
                                            handle={(e) => setData("user_id", e.target.value)}
                                            errors={errors.user_id}
                                            value={data.user_id}
                                        ></TemplateInputLabel>
                                        <TemplateInputLabel
                                            id={"name"}
                                            title={"User Name"}
                                            handle={(e) => setData("name", e.target.value)}
                                            errors={errors.name}
                                            value={data.name}
                                        ></TemplateInputLabel>
                                        <TemplateInputLabel
                                            id={"password"}
                                            title={"Password"}
                                            type='password'
                                            handle={(e) => setData("password", e.target.value)}
                                            errors={errors.password}
                                            value={data.password}
                                        ></TemplateInputLabel>
                                        <TemplateSwitchLabel
                                            id={"flag_active"}
                                            title={"Flag Active"}
                                            value={data.flag_active}
                                            handle={(e) => setData("flag_active", e)}
                                        ></TemplateSwitchLabel>
                                    </>
                            }
                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                <PrimaryButton className="ml-3" disabled={processing}>
                                    {textModal} User
                                </PrimaryButton>
                            </div>
                        </form>
                    </Modal>
                </ div>
            }
        >
        </AuthenticatedLayout>
    );
}
