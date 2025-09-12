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

        return [
            'name' => fake()->company(),
            'siret' => fake()->numerify('##############'),
            'description' => fake()->optional(0.8)->sentence(10),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
            'website' => fake()->optional(0.6)->url(),
            'timezone' => fake()->randomElement($timezones),
            'is_active' => fake()->boolean(85),
            'number_places_available' => fake()->optional(0.7)->numberBetween(1, 100),
            'price_places_available' => fake()->optional(0.5)->randomFloat(2, 10, 1000),
            'address_id' => Address::factory(),
            'manager_id' => User::factory(),
        ];
    }
}
