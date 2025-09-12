<?php

namespace App\Services\Establishment;

use App\Enums\PaginationEnum;
use App\Models\Establishment;
use App\Services\Establishment\Data\EstablishmentData;

class EstablishmentService
{
    public function getActivePaginated(?int $perPage = null)
    {
        $perPage = $perPage ?? PaginationEnum::DEFAULT_PAGINATION->value();

        return Establishment::with(['address', 'manager', 'collaborators'])
            ->where('is_active', true)
            ->paginate($perPage)
            ->through(fn (Establishment $establishment) => EstablishmentData::from($establishment));
    }
}
