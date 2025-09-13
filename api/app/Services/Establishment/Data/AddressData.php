<?php

namespace App\Services\Establishment\Data;

use Spatie\LaravelData\Data;

class AddressData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $line1,
        public readonly ?string $line2,
        public readonly string $postal_code,
        public readonly string $city,
        public readonly string $region,
        public readonly string $country,
        public readonly ?float $latitude,
        public readonly ?float $longitude,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {}
}
