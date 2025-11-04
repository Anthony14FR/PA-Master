<?php

namespace App\Services\User\Data;

use Spatie\LaravelData\Data;

class UserProfileData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $first_name,
        public readonly ?string $last_name,
        public readonly string $email,
        public readonly ?string $phone,
        public readonly ?string $avatar_url,
        public readonly ?bool $is_id_verified,
        public readonly ?string $email_verified_at,
        public readonly array $roles,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {}
}
