import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import SearchColumn from '@/Components/SearchColumn';


export default function UserPage({ auth }) {
    const [subjects, setSubjects] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterTextYear, setFilterTextYear] = useState('');
    const [filterTextStudentName, setFilterTextStudentName] = useState('');
    const [filterTextSubjectName, setFilterTextSubjectName] = useState('');

    const countPerPage = 3;
    const getSubjectList = () => {
        setLoading(true);
        axios.post(route('report.get_all_data'),
            {
                search: {
                    filterTextYear: filterTextYear,
                    filterTextStudentName: filterTextStudentName,
                    filterTextSubjectName: filterTextSubjectName,
                },
                sort: sort,
                page: page,
                per_page: countPerPage,
                delay: 1
            })
            .then(res => {
                setSubjects(res.data);
            })
            .finally(() => setLoading(false));;
    }
    useEffect(() => {
        getSubjectList();
    }, [page, sort, filterTextYear, filterTextStudentName, filterTextSubjectName]);




    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const subHeaderComponentMemo = useMemo(() => {
        const handleClearTextYear = () => {
            if (filterTextYear) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterTextYear('');
            }
        };
        const handleClearTextStudentName = () => {
            if (filterTextStudentName) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterTextStudentName('');
            }
        };
        const handleClearTextSubjectName = () => {
            if (filterTextSubjectName) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterTextSubjectName('');
            }
        };
        return (
            <div className="grid grid-rows-none grid-flow-col gap-4 mx-auto ">
                <div className='flex items-center gap-2'>
                    <SearchColumn
                        placeholderFilter={"Filter Year"}
                        onFilter={e => setFilterTextYear(e.target.value)}
                        onClear={handleClearTextYear} filterText={filterTextYear} />
                </div>
                <div className='flex items-center gap-2'>
                    <SearchColumn
                        placeholderFilter={"Filter Student Name"}
                        onFilter={e => setFilterTextStudentName(e.target.value)}
                        onClear={handleClearTextStudentName} filterText={filterTextStudentName} />
                </div>
                <div className='flex items-center gap-2'>
                    <SearchColumn
                        placeholderFilter={"Filter Subject Name"}
                        onFilter={e => setFilterTextSubjectName(e.target.value)}
                        onClear={handleClearTextSubjectName} filterText={filterTextSubjectName} />
                </div>
            </div>
        );
    }, [filterTextYear, filterTextStudentName, filterTextSubjectName, resetPaginationToggle]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subject</h2>}

            children={
                <div className="bg-white grid justify-items-stretch ">
                    <DataTable
                        actions
                        columns={[
                            {
                                name: 'Subject Id',
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
                                name: 'Year',
                                selector: (row, i) => row.year,
                                sortable: true,
                                sortField: 'year',
                            },
                            {
                                name: 'Grade',
                                selector: (row, i) => row.grade,
                                sortable: true,
                                sortField: 'grade',
                            },
                            {
                                name: 'Status',
                                selector: (row, i) => row.status,
                                sortable: true,
                                sortField: 'status',
                            },
                        ]
                        }
                        data={subjects.data}
                        highlightOnHover
                        progressPending={loading}
                        sortServer
                        onSort={(sort, direction) => {
                            sort.direction = direction;
                            setSort(sort);
                        }}

                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}

                        pagination
                        paginationServer
                        paginationTotalRows={subjects.total}
                        paginationPerPage={countPerPage}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        onChangePage={page => setPage(page)}

                    />
                </div>
            }
        >
        </AuthenticatedLayout>

    );
}
