<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pet extends Model
{
    protected $fillable = [
        'user_id',
        'animal_type_id',
        'name',
        'breed',
        'birth_date',
        'sex',
        'weight',
        'is_sterilized',
        'has_microchip',
        'microchip_number',
        'adoption_date',
        'about',
        'health_notes',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'adoption_date' => 'date',
        'weight' => 'decimal:2',
        'is_sterilized' => 'boolean',
        'has_microchip' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function animalType(): BelongsTo
    {
        return $this->belongsTo(AnimalType::class);
    }
}
