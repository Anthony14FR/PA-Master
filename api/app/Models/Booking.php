<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'establishment_id',
        'check_in_date',
        'check_out_date',
        'total_price',
        'status',
        'payment_status',
        'special_requests',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_price' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function pets(): BelongsToMany
    {
        return $this->belongsToMany(Pet::class, 'booking_pets');
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'booking_services')->withPivot('price');
    }
}
