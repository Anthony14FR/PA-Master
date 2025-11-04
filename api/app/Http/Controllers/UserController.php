<?php

namespace App\Http\Controllers;

use App\Enums\ApiStatus;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Requests\User\UploadAvatarRequest;
use App\Services\User\Data\UpdateProfileData;
use App\Services\User\Exceptions\AvatarUploadException;
use App\Services\User\Exceptions\UserHasActiveBookingsException;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(): JsonResponse
    {
        $users = $this->userService->getAllPaginated();

        return response()->json([
            'data' => $users,
            'status' => ApiStatus::SUCCESS,
            'timestamp' => human_date(Carbon::now()),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        if (! Str::isUuid($id)) {
            return response()->json([
                'message' => 'Invalid UUID format',
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(Carbon::now()),
            ], 400);
        }

        $user = $this->userService->getPublicProfile($id);

        if (! $user) {
            return response()->json([
                'message' => 'User not found',
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(Carbon::now()),
            ], 404);
        }

        return response()->json([
            'data' => $user,
            'status' => ApiStatus::SUCCESS,
            'timestamp' => human_date(Carbon::now()),
        ]);
    }

    public function getCurrentUser(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('roles');

        return response()->json([
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'locale' => $user->locale,
            'is_id_verified' => $user->is_id_verified,
            'email_verified_at' => $user->email_verified_at,
            'roles' => $user->roles->pluck('name'),
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        $updateData = UpdateProfileData::from([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'phone' => $request->input('phone'),
        ]);

        $updatedUser = $this->userService->updateProfile($user, $updateData);

        return response()->json([
            'data' => $updatedUser,
            'message' => 'Profile updated successfully',
            'status' => ApiStatus::SUCCESS,
            'timestamp' => human_date(Carbon::now()),
        ]);
    }

    public function uploadAvatar(UploadAvatarRequest $request): JsonResponse
    {
        try {
            $user = $request->user();

            $updatedUser = $this->userService->uploadAvatar($user, $request->file('avatar'));

            return response()->json([
                'data' => $updatedUser,
                'message' => 'Avatar uploaded successfully',
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ]);
        } catch (AvatarUploadException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(Carbon::now()),
            ], 500);
        }
    }

    public function updateLocale(Request $request): JsonResponse
    {
        $availableLocales = explode(',', config('app.available_locales', 'en'));

        $request->validate([
            'locale' => ['required', 'string', 'in:'.implode(',', $availableLocales)],
        ]);

        $user = $request->user();
        $user->update(['locale' => $request->locale]);

        return response()->json([
            'success' => true,
            'locale' => $user->locale,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $this->userService->deleteAccount($user);

            return response()->json([
                'message' => 'Account deleted successfully',
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ]);
        } catch (UserHasActiveBookingsException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(Carbon::now()),
            ], 422);
        }
    }
}
