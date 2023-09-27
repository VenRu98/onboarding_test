<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubjectRequest;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class SubjectController extends Controller
{

    public function get_all_data(Request $request)
    {
        if ($request->ajax()) {
            $datas = Subject::paginate($request->per_page ?? 5);
            return $datas;
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subject_ids = Subject::all()->pluck("subject_id");
        Log::warning($subject_ids);
        return Inertia::render('Subject/SubjectPage', [
            'subject_ids' => $subject_ids,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubjectRequest $request)
    {
        $subject = new Subject();
        $subject->subject_id = $request->subject_id;
        $subject->subject_name = $request->subject_name;
        $subject->credit = $request->credit;
        $subject->subject_pre_required = $request->subject_pre_required ?? null;
        $subject->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $subject = Subject::findOrFail($id);
        return $subject;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $subject = Subject::findOrFail($id);
        $subject->subject_id = $request->subject_id;
        $subject->subject_name = $request->subject_name;
        $subject->credit = $request->credit;
        $subject->subject_pre_required = $request->subject_pre_required ?? null;
        $subject->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
    }
}
