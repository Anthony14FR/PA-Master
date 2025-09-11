<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Establishment extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
        'phone',
        'email',
        'website',
        'address_id',
        'timezone',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
}
