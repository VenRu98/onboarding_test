<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEnrollmentRequest;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EnrollmentAndGradingController extends Controller
{
    public function get_all_data(Request $request)
    {
        if ($request->ajax()) {
            $datas = Enrollment::select("*");
            if (count($request->sort) != 0) {
                $column_name =   $request->sort["sortField"];
                $sort_direction =   $request->sort["direction"];
                $datas = $datas->orderBy($column_name, $sort_direction);
            }
            $datas = $datas->paginate($request->per_page ?? 5);
            return $datas;
        }
    }
    public function index()
    {
        $enrollment_ids = Student::all()->pluck("student_id");
        $subject_ids = Subject::all()->pluck("subject_id");
        return Inertia::render('EnrollmentAndGrading/EnrollmentAndGradingPage', [
            'student_ids' => $enrollment_ids,
            'subject_ids' => $subject_ids,
        ]);
    }
    public function store(StoreEnrollmentRequest $request)
    {
        $enrollment = new Enrollment();
        $enrollment->subject_id = $request->subject_id;
        $enrollment->student_id = $request->student_id;
        $enrollment->enroll_start_date = $request->enroll_start_date;
        $enrollment->enroll_end_date = $request->enroll_end_date;
        $enrollment->status = $request->status;
        $enrollment->grade = $request->grade;
        $enrollment->save();
    }
    public function show(string $id)
    {
        $enrollment = Enrollment::findOrFail($id);
        return $enrollment;
    }
    public function destroy(string $id)
    {
        $enrollment = Enrollment::findOrFail($id);
        $enrollment->delete();
    }
}
