<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Establishment;
use Illuminate\Database\Seeder;

class EstablishmentSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = Address::factory()->count(5)->create();

        $addresses->each(function ($address) {
            Establishment::factory()->create([
                'address_id' => $address->id,
            ]);
        });
    }
}
