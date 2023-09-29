<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['string', 'required', Rule::unique(User::class, 'user_id')],
            'name' => ['string', 'required', Rule::unique(User::class, 'name')],
            'password' => ['string', 'required'],
            'flag_active' => ['bool', 'required'],
        ];
    }
}
