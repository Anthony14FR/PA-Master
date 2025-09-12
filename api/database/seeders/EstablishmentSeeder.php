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
        $addresses = Address::factory()->count(5)->create();
        $managers = User::factory()->count(5)->create();
        $collaborators = User::factory()->count(10)->create();

        $addresses->each(function ($address) use ($managers, $collaborators) {
            $establishment = Establishment::factory()->create([
                'address_id' => $address->id,
                'manager_id' => $managers->random()->id,
            ]);

            $establishment->collaborators()->attach(
                $collaborators->random(min(3, $collaborators->count()))->pluck('id')
            );
        });
    }
}
