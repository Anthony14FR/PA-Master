<?php

namespace App\Models;

use App\Enums\UserStatus;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, HasRoles, HasUuids, Notifiable;

    private const PASSWORD_CAST = 'hashed';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar_url',
        'is_id_verified',
        'status',
        'password',
        'locale',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_id_verified' => 'boolean',
            'status' => UserStatus::class,
            'password' => self::PASSWORD_CAST,
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope('active', function (Builder $query): void {
            $query->where('status', UserStatus::ACTIVE);
        });
    }

    public function scopeWithInactive(Builder $query): Builder
    {
        return $query->withoutGlobalScope('active');
    }

    public function managedEstablishments(): HasMany
    {
        return $this->hasMany(Establishment::class, 'manager_id');
    }

    public function collaboratedEstablishments(): BelongsToMany
    {
        return $this->belongsToMany(Establishment::class, 'establishment_collaborators', 'user_id', 'establishment_id');
    }
}
