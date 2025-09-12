<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Establishment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'siret',
        'description',
        'phone',
        'email',
        'website',
        'address_id',
        'timezone',
        'is_active',
        'number_places_available',
        'price_places_available',
        'manager_id',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'number_places_available' => 'integer',
        ];
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function collaborators(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'establishment_collaborators', 'establishment_id', 'user_id');
    }
}
