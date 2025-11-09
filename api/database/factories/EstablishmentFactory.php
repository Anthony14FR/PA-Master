<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EstablishmentFactory extends Factory
{
    public function definition(): array
    {
        $timezones = [
            'Europe/Paris',
            'Europe/London',
        ];

        $petCareNames = [
            'Happy Paws Pension',
            'Pet Paradise',
            'Les Amis à Quatre Pattes',
            'Au Bonheur des Animaux',
            'Toutou & Minou Hôtel',
            'La Pension des Animaux',
            'Patte d\'Or',
            'Le Refuge des Compagnons',
            'Animaux en Vacances',
            'Le Paradis des Animaux',
            'La Maison des Animaux',
            'Pension Animalière du Parc',
            'Au Nid Douillet',
            'Les Quatre Pattes',
            'Pension Zen pour Animaux',
        ];

        return [
            'name' => fake()->randomElement($petCareNames),
            'siret' => fake()->numerify('##############'),
            'description' => fake()->optional(0.8)->sentence(10),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
            'website' => fake()->optional(0.6)->url(),
            'timezone' => fake()->randomElement($timezones),
            'is_active' => fake()->boolean(85),
            'address_id' => Address::factory(),
            'manager_id' => User::factory(),
        ];
    }
}
