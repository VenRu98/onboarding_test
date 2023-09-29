<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Enrollment
 *
 * @property int $id
 * @property string $subject_id
 * @property string $student_id
 * @property string $enroll_start_date
 * @property string $enroll_end_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment query()
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment whereEnrollEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment whereEnrollStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment whereStudentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Enrollment whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Enrollment extends Model
{
    use HasFactory;

    public function enrollment_student()
    {
        return $this->belongsTo(Student::class, 'student_id','student_id');
    }
    public function enrollment_subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id','subject_id');
    }
}
