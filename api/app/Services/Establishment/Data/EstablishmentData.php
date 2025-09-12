<?php

namespace App\Services\Establishment\Data;

use App\Models\Establishment;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;

class EstablishmentData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $siret,
        public readonly ?string $description,
        public readonly ?string $phone,
        public readonly ?string $email,
        public readonly ?string $website,
        public readonly string $address_id,
        public readonly string $timezone,
        public readonly bool $is_active,
        public readonly ?int $number_places_available,
        public readonly ?float $price_places_available,
        public readonly int $manager_id,
        public readonly string $created_at,
        public readonly string $updated_at,
        public readonly ?AddressData $address = null,
        public readonly ?UserData $manager = null,
        public readonly ?Collection $collaborators = null,
    ) {}

    public static function fromModel(Establishment $establishment): self
    {
        $address = null;
        if (! blank($establishment->address)) {
            $address = AddressData::from($establishment->address);
        }

        $manager = null;
        if (! blank($establishment->manager)) {
            $manager = UserData::from($establishment->manager);
        }

        $collaborators = null;
        if (! blank($establishment->collaborators)) {
            $collaborators = collect();
            foreach ($establishment->collaborators as $user) {
                $collaborators->push(UserData::from($user));
            }
        }

        return new self(
            id: (string) $establishment->id,
            name: $establishment->name,
            siret: $establishment->siret,
            description: $establishment->description,
            phone: $establishment->phone,
            email: $establishment->email,
            website: $establishment->website,
            address_id: (string) $establishment->address_id,
            timezone: $establishment->timezone,
            is_active: (bool) $establishment->is_active,
            number_places_available: $establishment->number_places_available,
            price_places_available: $establishment->price_places_available,
            manager_id: (int) $establishment->manager_id,
            created_at: human_date($establishment->created_at),
            updated_at: human_date($establishment->updated_at),
            address: $address,
            manager: $manager,
            collaborators: $collaborators,
        );
    }
}
