<?php

namespace App\Services\User;

use App\Enums\PaginationEnum;
use App\Models\User;

class UserService
{
    public function getAllPaginated(?int $perPage = null)
    {
        $perPage = $perPage ?? PaginationEnum::DEFAULT_PAGINATION->value();

        return User::with(['managedEstablishments', 'collaboratedEstablishments'])
            ->paginate($perPage);
    }
}
