<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function get_all_data(Request $request)
    {
        if ($request->ajax()) {
            $datas = User::select("*")->where('id', '!=', Auth::user()->id);
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
        return Inertia::render('User/UserPage');
    }
    public function store(StoreUserRequest $request)
    {
        $user = new User();
        $user->user_id = $request->user_id;
        $user->name = $request->name;
        $user->password = Hash::make($request->password);
        $user->flag_active = $request->flag_active ? 1 : 0;
        $user->save();
    }
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return $user;
    }
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'user_id' => ['string', 'required', Rule::unique(User::class, 'user_id')->ignore($user->user_id, "user_id")],
            'name' => ['string', 'required'],
            'password' => ['string', 'required'],
            'flag_active' => ['bool', 'required'],
        ]);
        $user->user_id = $request->user_id;
        $user->name = $request->name;
        $user->password = $request->password;
        $user->flag_active = $request->flag_active ? 1 : 0;
        $user->save();
    }
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
    }
}
