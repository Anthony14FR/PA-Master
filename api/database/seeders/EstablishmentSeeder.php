<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Establishment;
use App\Models\User;
use Illuminate\Database\Seeder;

class EstablishmentSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = Address::inRandomOrder()->limit(5)->get();
        if ($addresses->isEmpty()) {
            throw new \RuntimeException('No addresses found. Run AddressSeeder first.');
        }

        $managers = User::inRandomOrder()->limit(5)->get();
        if ($managers->isEmpty()) {
            throw new \RuntimeException('No users found. Run UsersSeeder first.');
        }

        $collaborators = User::inRandomOrder()->limit(10)->get();

        $addresses->each(function ($address) use ($managers, $collaborators) {
            $establishment = Establishment::factory()->create([
                'address_id' => $address->id,
                'manager_id' => $managers->random()->id,
            ]);

            if ($collaborators->isNotEmpty()) {
                $establishment->collaborators()->attach(
                    $collaborators->random(min(3, $collaborators->count()))->pluck('id')
                );
            }
        });
    }
}
