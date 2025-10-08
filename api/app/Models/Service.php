<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $fillable = [
        'establishment_id',
        'animal_type_id',
        'name',
        'description',
        'is_included',
        'price',
    ];

    protected $casts = [
        'is_included' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function animalType(): BelongsTo
    {
        return $this->belongsTo(AnimalType::class);
    }
}
