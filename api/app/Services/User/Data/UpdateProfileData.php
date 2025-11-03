<?php

namespace App\Services\User\Data;

use Spatie\LaravelData\Data;

class UpdateProfileData extends Data
{
    public function __construct(
        public readonly ?string $first_name,
        public readonly ?string $last_name,
        public readonly ?string $phone,
    ) {}
}
