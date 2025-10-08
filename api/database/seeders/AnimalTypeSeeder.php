<?php

namespace Database\Seeders;

use App\Models\AnimalType;
use Illuminate\Database\Seeder;

class AnimalTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $animalTypes = [
            ['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals'],
            ['code' => 'cat', 'name' => 'Chat', 'category' => 'mammals'],
            ['code' => 'small_mammal', 'name' => 'Petit mammifère', 'category' => 'mammals'],
            ['code' => 'bird', 'name' => 'Oiseau', 'category' => 'birds'],
            ['code' => 'fish', 'name' => 'Poisson', 'category' => 'fish'],
            ['code' => 'reptile', 'name' => 'Reptile', 'category' => 'reptiles'],
            ['code' => 'amphibian', 'name' => 'Amphibien', 'category' => 'amphibians'],
            ['code' => 'invertebrate', 'name' => 'Invertébré', 'category' => 'invertebrates'],
        ];

        foreach ($animalTypes as $animalType) {
            AnimalType::updateOrCreate(
                ['code' => $animalType['code']],
                $animalType
            );
        }
    }
}
