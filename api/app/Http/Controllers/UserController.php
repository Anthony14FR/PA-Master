<?php

namespace App\Http\Controllers;

use App\Enums\ApiStatus;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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
}
