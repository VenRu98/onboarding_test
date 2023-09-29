<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function get_all_data(Request $request)
    {
        if ($request->ajax()) {
            $datas = Enrollment::select("*")->with('enrollment_student', 'enrollment_subject');
            $filterTextYear = $request->search["filterTextYear"];
            $filterTextStudentName = $request->search["filterTextStudentName"];
            $filterTextSubjectName = $request->search["filterTextSubjectName"];

            if (isset($filterTextYear)) {
                $datas
                    ->whereYear('enroll_start_date', $filterTextYear);
            }
            if (isset($filterTextStudentName)) {
                $datas->whereHas('enrollment_student', function ($q) use ($filterTextStudentName) {
                    $q->where(DB::raw('lower(student_name)'), 'like', "%{$filterTextStudentName}%");
                });
            }
            if (isset($filterTextSubjectName)) {
                $datas->whereHas('enrollment_subject', function ($q) use ($filterTextSubjectName) {
                    $q->where(DB::raw('lower(subject_name)'), 'like', "%{$filterTextSubjectName}%");
                });
            }

            if (count($request->sort) != 0) {
                $column_name =   $request->sort["sortField"];
                $sort_direction =   $request->sort["direction"];
                $datas = $datas->orderBy($column_name, $sort_direction);
            }
            $datas = $datas->paginate($request->per_page ?? 5);
            $datas->getCollection()->transform(function ($element) {
                $element->setAttribute('subject_name', $element->enrollment_subject?->subject_name ?? "");
                $element->setAttribute('student_name', $element->enrollment_student?->student_name ?? "");
                $element->setAttribute('year', Carbon::parse($element->enroll_start_date)->year);
                $element->setHidden(['enrollment_student', 'enrollment_subjet']);
                return $element;
            });
            return $datas;
        }
    }
    public function index()
    {
        return Inertia::render('Report/ReportPage');
    }
}
