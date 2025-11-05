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
        $addresses = Address::inRandomOrder()->limit(3)->get();
        if ($addresses->count() < 3) {
            throw new \RuntimeException('Need at least 3 addresses. Run AddressSeeder first.');
        }

        $manager1 = User::where('email', 'manager1@orus.com')->first();
        $manager2 = User::where('email', 'manager2@orus.com')->first();
        $manager3 = User::where('email', 'manager3@orus.com')->first();

        if (! $manager1 || ! $manager2 || ! $manager3) {
            throw new \RuntimeException('Managers not found. Run UsersSeeder first.');
        }

        $collaborators = User::inRandomOrder()->limit(10)->get();

        // Établissement 1 géré par Sophie Martin (manager1)
        $establishment1 = Establishment::factory()->create([
            'address_id' => $addresses[0]->id,
            'manager_id' => $manager1->id,
        ]);

        // Établissement 2 géré par Pierre Lefebvre (manager2)
        $establishment2 = Establishment::factory()->create([
            'address_id' => $addresses[1]->id,
            'manager_id' => $manager2->id,
        ]);

        // Établissement 3 géré par Julie Bernard (manager3)
        $establishment3 = Establishment::factory()->create([
            'address_id' => $addresses[2]->id,
            'manager_id' => $manager3->id,
        ]);

        if ($collaborators->isNotEmpty()) {
            foreach ([$establishment1, $establishment2, $establishment3] as $establishment) {
                $establishment->collaborators()->attach(
                    $collaborators->random(min(2, $collaborators->count()))->pluck('id')
                );
            }
        }
    }
}
