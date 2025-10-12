<?php

use App\Http\Controllers\EstablishmentController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'index']);

Route::middleware(['auth.jwt'])->group(function () {
    Route::apiResource('establishments', EstablishmentController::class);
});

Route::middleware(['auth.jwt', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class);
});

Route::middleware(['auth:jwt'])->get('/user', [UserController::class, 'getCurrentUser']);
Route::middleware(['auth:jwt'])->put('/user/locale', [UserController::class, 'updateLocale']);

require __DIR__.'/auth.php';
