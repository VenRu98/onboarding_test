<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEnrollmentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subject_id' => ['string', 'required'],
            'student_id' => ['string', 'required'],
            'enroll_start_date' => ['date', 'required'],
            'enroll_end_date' => ['date', 'required'],
            'status' => ['string', 'required'],
            'grade' => ['string', 'required'],
        ];
    }
}
