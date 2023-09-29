<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubjectRequest;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubjectController extends Controller
{

    public function get_all_data(Request $request)
    {
        if ($request->ajax()) {
            $datas = Subject::select("*");
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
        $subject_ids = Subject::all()->pluck("subject_id");
        return Inertia::render('Subject/SubjectPage', [
            'subject_ids' => $subject_ids,
        ]);
    }
    public function store(StoreSubjectRequest $request)
    {
        $subject = new Subject();
        $subject->subject_id = $request->subject_id;
        $subject->subject_name = $request->subject_name;
        $subject->credit = $request->credit;
        $subject->subject_pre_required = $request->subject_pre_required;
        $subject->save();
    }
    public function show(string $id)
    {
        $subject = Subject::findOrFail($id);
        return $subject;
    }
    public function update(Request $request, string $id)
    {
        $subject = Subject::findOrFail($id);
        $request->validate([
            'subject_id' => ['string', 'required', Rule::unique(Subject::class, 'subject_id')->ignore($subject->subject_id, "subject_id")],
            'subject_name' => ['string', 'required'],
            'credit' => ['int', 'required'],
        ]);
        $subject->subject_id = $request->subject_id;
        $subject->subject_name = $request->subject_name;
        $subject->credit = $request->credit;
        $subject->subject_pre_required = $request->subject_pre_required;
        $subject->save();
    }
    public function destroy(string $id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
    }
}
