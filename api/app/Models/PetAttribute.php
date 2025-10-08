<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PetAttribute extends Model
{
    protected $fillable = [
        'pet_id',
        'attribute_definition_id',
        'value_text',
        'value_number',
        'value_boolean',
        'value_date',
    ];

    protected $casts = [
        'value_number' => 'decimal:2',
        'value_boolean' => 'boolean',
        'value_date' => 'date',
    ];

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function attributeDefinition(): BelongsTo
    {
        return $this->belongsTo(AttributeDefinition::class);
    }
}
