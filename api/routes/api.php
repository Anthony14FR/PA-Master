<?php

use App\Http\Controllers\EstablishmentController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'index']);

Route::middleware(['auth.jwt'])->group(function () {
    Route::apiResource('establishments', EstablishmentController::class);
});

Route::middleware(['auth.jwt', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class);
});

Route::middleware(['auth.jwt'])->get('/user', function (Request $request) {
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
});

Route::middleware(['auth.jwt'])->put('/user/locale', function (Request $request) {
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
