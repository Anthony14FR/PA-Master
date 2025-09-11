<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasUuids;

    protected $fillable = [
        'line1',
        'line2',
        'postal_code',
        'city',
        'region',
        'country',
        'latitude',
        'longitude',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:10,8',
            'longitude' => 'decimal:11,8',
        ];
    }
}
