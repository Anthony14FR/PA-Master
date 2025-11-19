<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class JWTService
{
    /**
     * Generate an access token for the given user.
     */
    public function generateAccessToken(User $user): string
    {
        $payload = $this->buildPayload($user, config('jwt.access_token_ttl'));

        return $this->encodeToken($payload);
    }

    /**
     * Generate a refresh token for the given user.
     */
    public function generateRefreshToken(User $user): string
    {
        $payload = $this->buildPayload($user, config('jwt.refresh_token_ttl'), true);

        return $this->encodeToken($payload);
    }

    /**
     * Validate and decode a JWT token.
     *
     * @return object The decoded token payload
     *
     * @throws \Exception If token is invalid or expired
     */
    public function validateToken(string $token): object
    {
        try {
            JWT::$leeway = config('jwt.leeway', 60);

            $decoded = JWT::decode(
                $token,
                new Key(config('jwt.secret'), config('jwt.algorithm'))
            );

            if (config('jwt.blacklist_enabled') && $this->isBlacklisted($token)) {
                throw new \Exception('Token has been revoked');
            }

            return $decoded;
        } catch (\Firebase\JWT\ExpiredException $e) {
            throw new \Exception('Token has expired');
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            throw new \Exception('Token signature is invalid');
        } catch (\Exception $e) {
            throw new \Exception('Token validation failed: '.$e->getMessage());
        }
    }

    /**
     * Decode a token without validation (use with caution).
     * This should only be used for reading public claims.
     */
    public function decodeToken(string $token): object
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new \Exception('Invalid token format');
        }

        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')));

        return $payload;
    }

    /**
     * Extract the user ID from a token without full validation.
     */
    public function getUserIdFromToken(string $token): ?int
    {
        try {
            $payload = $this->decodeToken($token);

            return $payload->sub ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Add a token to the blacklist.
     */
    public function blacklistToken(string $token): void
    {
        if (! config('jwt.blacklist_enabled')) {
            return;
        }

        try {
            $payload = $this->decodeToken($token);
            $expiresAt = $payload->exp ?? null;

            if (! $expiresAt) {
                return;
            }

            $ttl = max(0, $expiresAt - time()) + config('jwt.blacklist_grace_period', 0);

            $tokenHash = $this->hashToken($token);
            Cache::put(
                $this->getBlacklistKey($tokenHash),
                true,
                $ttl
            );
        } catch (\Exception $e) {
            logger()->error('Failed to blacklist token: '.$e->getMessage());
        }
    }

    /**
     * Check if a token is blacklisted.
     */
    public function isBlacklisted(string $token): bool
    {
        if (! config('jwt.blacklist_enabled')) {
            return false;
        }

        $tokenHash = $this->hashToken($token);

        return Cache::has($this->getBlacklistKey($tokenHash));
    }

    /**
     * Refresh an access token using a valid refresh token.
     *
     * @return array{access_token: string} New access token
     *
     * @throws \Exception If refresh token is invalid
     */
    public function refreshAccessToken(string $refreshToken): array
    {
        $payload = $this->validateToken($refreshToken);

        if (! isset($payload->type) || $payload->type !== 'refresh') {
            throw new \Exception('Invalid token type');
        }

        $user = User::find($payload->sub);
        if (! $user) {
            throw new \Exception('User not found');
        }

        $accessToken = $this->generateAccessToken($user);

        return [
            'access_token' => $accessToken,
        ];
    }

    /**
     * Build the JWT payload.
     */
    protected function buildPayload(User $user, int $ttl, bool $isRefreshToken = false): array
    {
        $now = time();
        $exp = $now + $ttl;

        $payload = [
            'iss' => config('jwt.issuer'),
            'aud' => config('jwt.audience'),
            'iat' => $now,
            'exp' => $exp,
            'sub' => $user->id,
            'jti' => Str::uuid()->toString(),
        ];

        if (! $isRefreshToken) {
            $payload['uuid'] = $user->id;
            $payload['email'] = $user->email;
            $payload['roles'] = $user->roles->pluck('name')->toArray();
            $payload['locale'] = $user->locale ?? config('app.locale', 'en');
        }

        $payload['type'] = $isRefreshToken ? 'refresh' : 'access';

        return $payload;
    }

    /**
     * Encode a payload into a JWT token.
     */
    protected function encodeToken(array $payload): string
    {
        return JWT::encode(
            $payload,
            config('jwt.secret'),
            config('jwt.algorithm')
        );
    }

    /**
     * Hash a token for storage in blacklist.
     */
    protected function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    /**
     * Get the cache key for a blacklisted token.
     */
    protected function getBlacklistKey(string $tokenHash): string
    {
        return 'jwt_blacklist:'.$tokenHash;
    }
}
