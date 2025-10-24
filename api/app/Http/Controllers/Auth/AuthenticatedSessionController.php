<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\JWTService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    /**
     * The JWT service instance.
     */
    protected JWTService $jwtService;

    /**
     * Create a new controller instance.
     */
    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = $request->user();

        // Load user roles for JWT payload
        $user->load('roles');

        // Generate JWT tokens
        $accessToken = $this->jwtService->generateAccessToken($user);
        $refreshToken = $this->jwtService->generateRefreshToken($user);

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => config('jwt.access_token_ttl'),
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'locale' => $user->locale,
                'is_id_verified' => $user->is_id_verified,
                'email_verified_at' => $user->email_verified_at,
                'roles' => $user->roles->pluck('name'),
            ],
        ]);
    }

    /**
     * Refresh an access token using a refresh token.
     */
    public function refresh(Request $request): JsonResponse
    {
        $refreshToken = $request->input('refresh_token');

        if (! $refreshToken) {
            return response()->json([
                'message' => 'Refresh token is required',
            ], 400);
        }

        try {
            $result = $this->jwtService->refreshAccessToken($refreshToken);

            return response()->json([
                'access_token' => $result['access_token'],
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.access_token_ttl'),
            ]);
        } catch (\Exception $e) {
            Log::error('Token refresh failed: '.$e->getMessage());

            return response()->json([
                'message' => 'Token refresh failed',
                'error' => $e->getMessage(),
            ], 401);
        }
    }

    /**
     * Destroy an authenticated session (logout).
     */
    public function destroy(Request $request): Response
    {
        $refreshToken = $request->input('refresh_token');

        // Blacklist the refresh token if provided
        if ($refreshToken) {
            try {
                $this->jwtService->blacklistToken($refreshToken);
            } catch (\Exception $e) {
                Log::warning('Failed to blacklist refresh token: '.$e->getMessage());
            }
        }

        return response()->noContent();
    }
}
