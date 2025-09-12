<?php

namespace App\Http\Controllers;

use App\Enums\ApiStatus;
use App\Services\Establishment\EstablishmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class EstablishmentController extends Controller
{
    public function __construct(
        private EstablishmentService $establishmentService
    ) {}

    public function index(): JsonResponse
    {
        $establishments = $this->establishmentService->getActivePaginated();

        return response()->json([
            'data' => $establishments,
            'status' => ApiStatus::SUCCESS,
            'timestamp' => human_date(Carbon::now()),
        ]);
    }
}
