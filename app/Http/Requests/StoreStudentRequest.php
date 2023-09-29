<?php

namespace App\Http\Requests;

use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => ['string', 'required', Rule::unique(Student::class, 'student_id')],
            'student_name' => ['string', 'required'],
            'date_of_birth' => ['date', 'required'],
            'year_entrance' => ['int', 'required'],
        ];
    }
}
