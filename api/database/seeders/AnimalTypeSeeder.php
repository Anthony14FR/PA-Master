<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnimalTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $animalTypes = [
            [
                'code' => 'dog',
                'name' => 'Chien',
                'category' => 'mammals',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'cat',
                'name' => 'Chat',
                'category' => 'mammals',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'small_mammal',
                'name' => 'Petit mammifère',
                'category' => 'mammals',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'bird',
                'name' => 'Oiseau',
                'category' => 'birds',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'fish',
                'name' => 'Poisson',
                'category' => 'fish',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'reptile',
                'name' => 'Reptile',
                'category' => 'reptiles',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'amphibian',
                'name' => 'Amphibien',
                'category' => 'amphibians',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'invertebrate',
                'name' => 'Invertébré',
                'category' => 'invertebrates',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('animal_types')->insert($animalTypes);
    }
}
