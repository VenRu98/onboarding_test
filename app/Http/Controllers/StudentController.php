<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function get_all_data(Request $request)
    {
        if ($request->ajax()) {
            $datas = Student::select("*");
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
        return Inertia::render('MasterStudent/MasterStudentPage');
    }
    public function store(StoreStudentRequest $request)
    {
        $student = new Student();
        $student->student_id = $request->student_id;
        $student->student_name = $request->student_name;
        $student->date_of_birth = $request->date_of_birth;
        $student->year_entrance = $request->year_entrance;
        $student->save();
    }
    public function show(string $id)
    {
        $student = Student::findOrFail($id);
        return $student;
    }
    public function update(Request $request, string $id)
    {
        $student = Student::findOrFail($id);
        $request->validate([
            'student_id' => ['string', 'required', Rule::unique(Student::class, 'student_id')->ignore($student->student_id, "student_id")],
            'student_name' => ['string', 'required'],
            'date_of_birth' => ['date', 'required'],
            'year_entrance' => ['int', 'required'],
        ]);
        $student->student_id = $request->student_id;
        $student->student_name = $request->student_name;
        $student->date_of_birth = $request->date_of_birth;
        $student->year_entrance = $request->year_entrance;
        $student->save();
    }
    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
    }
}
