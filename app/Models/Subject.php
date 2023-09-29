<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Subject
 *
 * @property int $id
 * @property string $subject_id
 * @property string $subject_name
 * @property int $credit
 * @property string $subject_pre_required
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Subject newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Subject newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Subject query()
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereCredit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereSubjectName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereSubjectPreRequired($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Subject extends Model
{
    use HasFactory, SoftDeletes;

    public function subject_child()
    {
        return $this->hasMany(Subject::class, 'subject_pre_required', 'subject_id');
    }
    public function subject_parent()
    {
        return $this->belongsTo(Subject::class, 'subject_pre_required', 'subject_id');
    }

    public function subject_enrollment()
    {
        return $this->hasMany(Enrollment::class, 'subject_id', 'subject_id');
    }
}
