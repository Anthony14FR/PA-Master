<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User
        User::firstOrCreate(
            ['email' => 'user@orus.com'],
            [
                'first_name' => 'User',
                'last_name' => 'Account',
                'password' => Hash::make('user'),
                'email_verified_at' => now(),
                'is_id_verified' => false,
            ]
        )->assignRole('user');

        // Manager
        User::firstOrCreate(
            ['email' => 'manager@orus.com'],
            [
                'first_name' => 'Manager',
                'last_name' => 'Account',
                'password' => Hash::make('manager'),
                'email_verified_at' => now(),
                'is_id_verified' => false,
            ]
        )->assignRole('manager');

        // Admin
        User::firstOrCreate(
            ['email' => 'admin@orus.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'Account',
                'password' => Hash::make('admin'),
                'email_verified_at' => now(),
                'is_id_verified' => false,
            ]
        )->assignRole('admin');
    }
}
