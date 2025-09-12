<?php

namespace App\Services\Establishment\Data;

use App\Models\Address;
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

    public static function fromModel(Address $address): self
    {
        return self::from([
            'id' => (string) $address->id,
            'line1' => $address->line1,
            'line2' => $address->line2,
            'postal_code' => $address->postal_code,
            'city' => $address->city,
            'region' => $address->region,
            'country' => $address->country,
            'latitude' => $address->latitude,
            'longitude' => $address->longitude,
            'created_at' => human_date($address->created_at),
            'updated_at' => human_date($address->updated_at),
        ]);
    }
}
