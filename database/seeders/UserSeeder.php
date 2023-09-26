<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'user_id' => 10001,
                'name' => 'Admin',
                'password' => 'admin',
                'flag_active' => 1,
            ]
        ];
        foreach ($datas as $key => $value) {
            $user = new User();
            $user->user_id = $value['user_id'];
            $user->name = $value['name'];
            $user->password = Hash::make($value['password']);
            $user->flag_active = $value['flag_active'];
            $user->save();
        }
    }
}
