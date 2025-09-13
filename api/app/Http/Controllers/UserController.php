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
}
