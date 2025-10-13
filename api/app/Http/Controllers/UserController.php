<?php

namespace App\Http\Controllers;

use App\Enums\ApiStatus;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
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

    public function getCurrentUser(): JsonResponse
    {
        $user = auth()->user();

        return response()->json($user);
    }

    public function updateLocale(): JsonResponse
    {
        $availableLocales = explode(',', config('app.available_locales', 'en'));

        request()->validate([
            'locale' => ['required', 'string', 'in:'.implode(',', $availableLocales)],
        ]);

        $user = auth()->user();
        $user->update(['locale' => request('locale')]);

        return response()->json([
            'success' => true,
            'locale' => $user->locale,
        ]);
    }
}
