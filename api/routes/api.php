<?php

use App\Http\Controllers\EstablishmentController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('establishments', EstablishmentController::class);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class);
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->put('/user/locale', function (Request $request) {
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
});

require __DIR__.'/auth.php';
