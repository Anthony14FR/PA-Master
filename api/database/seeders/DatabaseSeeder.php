<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UsersSeeder::class,
            EstablishmentSeeder::class,
        ]);

        User::factory(5)->create()->each(function ($user) {
            if (Role::where('name', 'user')->exists()) {
                $user->assignRole('user');
            }
        });

        User::factory(5)->unverified()->create()->each(function ($user) {
            if (Role::where('name', 'user')->exists()) {
                $user->assignRole('user');
            }
        });
    }
}
