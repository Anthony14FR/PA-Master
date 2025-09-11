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
                'name' => 'User',
                'password' => Hash::make('user'),
                'email_verified_at' => now(),
            ]
        )->assignRole('user');

        // Manager
        User::firstOrCreate(
            ['email' => 'manager@orus.com'],
            [
                'name' => 'Manager',
                'password' => Hash::make('manager'),
                'email_verified_at' => now(),
            ]
        )->assignRole('manager');

        // Admin
        User::firstOrCreate(
            ['email' => 'admin@orus.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin'),
                'email_verified_at' => now(),
            ]
        )->assignRole('admin');
    }
}
