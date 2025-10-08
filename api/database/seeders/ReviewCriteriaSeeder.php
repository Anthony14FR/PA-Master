<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criteria for evaluating ESTABLISHMENTS (by users)
        $establishmentCriteria = [
            [
                'code' => 'cleanliness',
                'label' => 'Propreté',
                'applicable_to' => 'establishment',
                'sort_order' => 1,
            ],
            [
                'code' => 'communication',
                'label' => 'Communication',
                'applicable_to' => 'establishment',
                'sort_order' => 2,
            ],
            [
                'code' => 'animal_care',
                'label' => 'Soins apportés à l\'animal',
                'applicable_to' => 'establishment',
                'sort_order' => 3,
            ],
            [
                'code' => 'instructions_respect',
                'label' => 'Respect des consignes',
                'applicable_to' => 'establishment',
                'sort_order' => 4,
            ],
            [
                'code' => 'value_for_money',
                'label' => 'Rapport qualité/prix',
                'applicable_to' => 'establishment',
                'sort_order' => 5,
            ],
        ];

        // Criteria for evaluating USERS (by establishments)
        $userCriteria = [
            [
                'code' => 'info_accuracy',
                'label' => 'Exactitude des informations',
                'applicable_to' => 'user',
                'sort_order' => 1,
            ],
            [
                'code' => 'punctuality',
                'label' => 'Ponctualité',
                'applicable_to' => 'user',
                'sort_order' => 2,
            ],
            [
                'code' => 'animal_condition',
                'label' => 'État de l\'animal à l\'arrivée',
                'applicable_to' => 'user',
                'sort_order' => 3,
            ],
        ];

        $allCriteria = array_merge($establishmentCriteria, $userCriteria);

        foreach ($allCriteria as $criteria) {
            DB::table('review_criteria_definitions')->updateOrInsert(
                ['code' => $criteria['code']],
                array_merge($criteria, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
