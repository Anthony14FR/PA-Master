<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttributeOption extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'attribute_definition_id',
        'value',
        'label',
        'display_order',
    ];

    protected $casts = [
        'display_order' => 'integer',
    ];

    public function attributeDefinition(): BelongsTo
    {
        return $this->belongsTo(AttributeDefinition::class);
    }
}
