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
        // Admin
        User::firstOrCreate(
            ['email' => 'admin@orus.com'],
            [
                'first_name' => 'Thomas',
                'last_name' => 'Dubois',
                'password' => Hash::make('admin'),
                'email_verified_at' => now(),
                'is_id_verified' => true,
            ]
        )->assignRole('admin');

        // Managers (un par établissement)
        $manager1 = User::firstOrCreate(
            ['email' => 'manager1@orus.com'],
            [
                'first_name' => 'Sophie',
                'last_name' => 'Martin',
                'password' => Hash::make('manager'),
                'email_verified_at' => now(),
                'is_id_verified' => true,
            ]
        );
        $manager1->assignRole('manager');

        $manager2 = User::firstOrCreate(
            ['email' => 'manager2@orus.com'],
            [
                'first_name' => 'Pierre',
                'last_name' => 'Lefebvre',
                'password' => Hash::make('manager'),
                'email_verified_at' => now(),
                'is_id_verified' => true,
            ]
        );
        $manager2->assignRole('manager');

        $manager3 = User::firstOrCreate(
            ['email' => 'manager3@orus.com'],
            [
                'first_name' => 'Julie',
                'last_name' => 'Bernard',
                'password' => Hash::make('manager'),
                'email_verified_at' => now(),
                'is_id_verified' => true,
            ]
        );
        $manager3->assignRole('manager');

        // Clients (users normaux)
        User::firstOrCreate(
            ['email' => 'client1@orus.com'],
            [
                'first_name' => 'Marie',
                'last_name' => 'Dupont',
                'password' => Hash::make('user'),
                'email_verified_at' => now(),
                'is_id_verified' => true,
            ]
        )->assignRole('user');

        User::firstOrCreate(
            ['email' => 'client2@orus.com'],
            [
                'first_name' => 'Jean',
                'last_name' => 'Moreau',
                'password' => Hash::make('user'),
                'email_verified_at' => now(),
                'is_id_verified' => true,
            ]
        )->assignRole('user');

        User::firstOrCreate(
            ['email' => 'client3@orus.com'],
            [
                'first_name' => 'Isabelle',
                'last_name' => 'Laurent',
                'password' => Hash::make('user'),
                'email_verified_at' => now(),
                'is_id_verified' => true,
            ]
        )->assignRole('user');

        User::firstOrCreate(
            ['email' => 'client4@orus.com'],
            [
                'first_name' => 'Lucas',
                'last_name' => 'Petit',
                'password' => Hash::make('user'),
                'email_verified_at' => now(),
                'is_id_verified' => true,
            ]
        )->assignRole('user');
    }
}
