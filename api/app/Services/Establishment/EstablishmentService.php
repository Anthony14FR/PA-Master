<?php

namespace App\Services\Establishment;

use App\Enums\PaginationEnum;
use App\Models\Establishment;
use App\Services\Establishment\Data\AddressData;
use App\Services\Establishment\Data\EstablishmentData;
use App\Services\Establishment\Data\UserData;

class EstablishmentService
{
    public function getActivePaginated(?int $perPage = null)
    {
        $perPage = $perPage ?? PaginationEnum::DEFAULT_PAGINATION->value();

        return Establishment::with(['address', 'manager', 'collaborators'])
            ->where('is_active', true)
            ->paginate($perPage)
            ->through(fn (Establishment $establishment) => $this->toEstablishmentData($establishment));
    }

    private function toEstablishmentData(Establishment $establishment): EstablishmentData
    {
        return new EstablishmentData(
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
            manager_id: (int) $establishment->manager_id,
            created_at: human_date($establishment->created_at),
            updated_at: human_date($establishment->updated_at),
            address: $establishment->address ? $this->toAddressData($establishment->address) : null,
            manager: $establishment->manager ? $this->toUserData($establishment->manager) : null,
            collaborators: $establishment->collaborators->map(fn ($user) => $this->toUserData($user))
        );
    }

    private function toAddressData($address): AddressData
    {
        return new AddressData(
            id: (string) $address->id,
            line1: $address->line1,
            line2: $address->line2,
            postal_code: $address->postal_code,
            city: $address->city,
            region: $address->region,
            country: $address->country,
            latitude: $address->latitude,
            longitude: $address->longitude,
            created_at: human_date($address->created_at),
            updated_at: human_date($address->updated_at),
        );
    }

    private function toUserData($user): UserData
    {
        return new UserData(
            id: (int) $user->id,
            first_name: $user->first_name,
            last_name: $user->last_name,
            email: $user->email,
            email_verified_at: $user->email_verified_at ? human_date($user->email_verified_at) : null,
            created_at: human_date($user->created_at),
            updated_at: human_date($user->updated_at),
        );
    }
}
