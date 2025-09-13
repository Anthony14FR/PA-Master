<?php

namespace App\Services\Establishment\Data;

use Spatie\LaravelData\Data;

class UserData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly ?string $first_name,
        public readonly ?string $last_name,
        public readonly string $email,
        public readonly ?string $email_verified_at,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {}
}
