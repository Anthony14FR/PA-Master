<?php

namespace App\Services\Establishment\Data;

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
}
