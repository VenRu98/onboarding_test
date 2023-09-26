<?php

namespace Database\Seeders;

use App\Models\MenuList;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'name' => "User",
                'route_name' => "user",
            ],
            [
                'name' => "Master Student",
                'route_name' => "student",
            ],
            [
                'name' => "Subject",
                'route_name' => "subject",
            ],
            [
                'name' => "Enrollment dan Grading",
                'route_name' => "enrollment_and_grading",
            ],
            [
                'name' => "Report",
                'route_name' => "report",
            ],
        ];
        foreach ($datas as $key => $value) {
            $menu_list = new MenuList();
            $menu_list->name = $value['name'];
            $menu_list->route_name = $value['route_name'];
            $menu_list->save();
        }
    }
}
