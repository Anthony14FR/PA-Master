<?php

namespace App\Services\Establishment\Data;

use App\Models\User;
use Spatie\LaravelData\Data;

class UserData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $email_verified_at,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {}

    public static function fromModel(User $user): self
    {
        return self::from([
            'id' => (int) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => ! blank($user->email_verified_at) ? human_date($user->email_verified_at) : null,
            'created_at' => human_date($user->created_at),
            'updated_at' => human_date($user->updated_at),
        ]);
    }
}
