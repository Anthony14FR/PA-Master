<?php

use App\Models\User;

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'access_token',
            'refresh_token',
            'token_type',
            'expires_in',
            'user' => ['id', 'first_name', 'last_name', 'email'],
        ]);
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    // Generate JWT token using JWTService
    $jwtService = app(\App\Services\JWTService::class);
    $user->load('roles');
    $accessToken = $jwtService->generateAccessToken($user);
    $refreshToken = $jwtService->generateRefreshToken($user);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer '.$accessToken,
    ])->post('/api/logout', [
        'refresh_token' => $refreshToken,
    ]);

    $response->assertNoContent();
});
