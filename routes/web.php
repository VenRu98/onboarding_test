<?php

use App\Http\Controllers\EnrollmentAndGradingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RefreshController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/developer_refresh', [RefreshController::class, 'refresh']);


Route::middleware(['auth', 'menu'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post("user/get_all_data", [UserController::class, "get_all_data"])->name('user.get_all_data');
    Route::resource("user", UserController::class);

    Route::post("student/get_all_data", [StudentController::class, "get_all_data"])->name('student.get_all_data');
    Route::resource("student", StudentController::class);

    Route::post("subject/get_all_data", [SubjectController::class, "get_all_data"])->name('subject.get_all_data');
    Route::resource("subject", SubjectController::class);

    Route::post("enrollment_and_grading/get_all_data", [EnrollmentAndGradingController::class, "get_all_data"])->name('enrollment_and_grading.get_all_data');
    Route::resource("enrollment_and_grading", EnrollmentAndGradingController::class);

    Route::post("report/get_all_data", [ReportController::class, "get_all_data"])->name('report.get_all_data');
    Route::resource("report", ReportController::class);
});

require __DIR__ . '/auth.php';
