<?php

namespace App\Http\Resources\Report;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportDataResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "subject_id" => $this->subject_id,
            "subject_name" => $this->subject_name,
            "student_id" => $this->student_id,
            "student_name" => $this->student_name,
            "year" => $this->year,
            "grade" => $this->grade,
            "status" => $this->status,
        ];
    }
}
