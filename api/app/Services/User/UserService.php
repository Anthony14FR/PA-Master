<?php

namespace App\Services\User;

use App\Enums\BookingStatus;
use App\Enums\PaginationEnum;
use App\Enums\UserStatus;
use App\Models\Booking;
use App\Models\User;
use App\Services\User\Data\UpdateProfileData;
use App\Services\User\Data\UserProfileData;
use App\Services\User\Exceptions\AvatarUploadException;
use App\Services\User\Exceptions\UserHasActiveBookingsException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class UserService
{
    public function getAllPaginated(?int $perPage = null)
    {
        $perPage = $perPage ?? PaginationEnum::DEFAULT_PAGINATION->value();

        return User::with(['managedEstablishments', 'collaboratedEstablishments'])
            ->paginate($perPage);
    }

    public function getPublicProfile(string $userId): ?UserProfileData
    {
        $user = User::find($userId);

        if (! $user) {
            return null;
        }

        return $this->toUserProfileData($user);
    }

    public function updateProfile(User $user, UpdateProfileData $data): UserProfileData
    {
        $updateData = array_filter([
            'first_name' => $data->first_name,
            'last_name' => $data->last_name,
            'phone' => $data->phone,
        ], fn ($value) => $value !== null);

        $user->update($updateData);

        return $this->toUserProfileData($user->fresh());
    }

    public function uploadAvatar(User $user, UploadedFile $avatar): UserProfileData
    {
        $oldAvatarPath = $user->avatar_url;
        $newPath = null;

        try {
            $newPath = $avatar->store('avatars', 'public');

            if (! $newPath) {
                throw AvatarUploadException::storageError('Unable to store file');
            }

            DB::transaction(function () use ($user, $newPath) {
                $user->update(['avatar_url' => $newPath]);
            });

            if ($oldAvatarPath) {
                Storage::disk('public')->delete($oldAvatarPath);
            }

            return $this->toUserProfileData($user->fresh());
        } catch (Throwable $e) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }

            if ($e instanceof AvatarUploadException) {
                throw $e;
            }

            throw AvatarUploadException::storageError($e->getMessage());
        }
    }

    public function deleteAccount(User $user): void
    {
        $hasActiveBookings = Booking::where('user_id', $user->id)
            ->whereIn('status', [
                BookingStatus::PENDING->value,
                BookingStatus::CONFIRMED->value,
                BookingStatus::IN_PROGRESS->value,
            ])
            ->exists();

        if ($hasActiveBookings) {
            throw UserHasActiveBookingsException::cannotDeleteAccount();
        }

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->update(['status' => UserStatus::INACTIVE]);
        });
    }

    private function toUserProfileData(User $user): UserProfileData
    {
        return new UserProfileData(
            id: (string) $user->id,
            first_name: $user->first_name,
            last_name: $user->last_name,
            email: $user->email,
            phone: $user->phone,
            avatar_url: $user->avatar_url ? Storage::disk('public')->url($user->avatar_url) : null,
            is_id_verified: $user->is_id_verified,
            email_verified_at: $user->email_verified_at ? human_date($user->email_verified_at) : null,
            roles: $user->getRoleNames()->toArray(),
            created_at: human_date($user->created_at),
            updated_at: human_date($user->updated_at),
        );
    }
}
