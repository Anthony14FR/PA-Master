<?php

namespace App\Http\Controllers;

use App\Enums\ApiStatus;
use Illuminate\Support\Carbon;

class TestController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Hello Thami',
            'status' => ApiStatus::SUCCESS,
            'timestamp' => Carbon::now(),
        ]);
    }
}
