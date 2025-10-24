<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JWTService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateJWT
{
    /**
     * The JWT service instance.
     */
    protected JWTService $jwtService;

    /**
     * Create a new middleware instance.
     */
    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $this->extractToken($request);

        if (! $token) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        try {
            // Validate the token
            $payload = $this->jwtService->validateToken($token);

            // Verify it's an access token
            if (! isset($payload->type) || $payload->type !== 'access') {
                throw new \Exception('Invalid token type');
            }

            // Get the user from the payload
            $user = User::find($payload->sub);

            if (! $user) {
                throw new \Exception('User not found');
            }

            // Load user roles for authorization
            $user->load('roles');

            // Set the authenticated user
            $request->setUserResolver(fn () => $user);

            // Optionally add token payload to request for easy access
            $request->attributes->set('jwt_payload', $payload);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unauthenticated.',
                'error' => $e->getMessage(),
            ], 401);
        }

        return $next($request);
    }

    /**
     * Extract the JWT token from the request.
     */
    protected function extractToken(Request $request): ?string
    {
        // Check Authorization header
        $header = $request->header('Authorization');
        if ($header && preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
            return $matches[1];
        }

        // Fallback: check query parameter (not recommended for production)
        if ($request->has('token')) {
            return $request->query('token');
        }

        return null;
    }
}
