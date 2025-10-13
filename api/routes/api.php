<?php

use App\Http\Controllers\EstablishmentController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('establishments', EstablishmentController::class);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class);
});

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'getCurrentUser']);

Route::middleware(['auth:sanctum'])->put('/user/locale', [UserController::class, 'updateLocale']);

require __DIR__.'/auth.php';
