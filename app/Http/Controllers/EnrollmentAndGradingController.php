<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentAndGradingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $enrollment_and_gradings = Enrollment::all();
        return Inertia::render('EnrollmentAndGrading/EnrollmentAndGradingPage', [
            'enrollment_and_gradings' => $enrollment_and_gradings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
}
