<?php

return [

    /*
    |--------------------------------------------------------------------------
    | JWT Secret Key
    |--------------------------------------------------------------------------
    |
    | The secret key used to sign JWT tokens. This should be a strong,
    | random string. For HS256 algorithm, this key is used for both
    | signing and verification. Keep this value secret!
    |
    */

    'secret' => env('JWT_SECRET'),

    /*
    |--------------------------------------------------------------------------
    | JWT Algorithm
    |--------------------------------------------------------------------------
    |
    | The algorithm used to sign JWT tokens. Supported algorithms:
    | - HS256 (HMAC with SHA-256) - Symmetric, requires shared secret
    | - HS384 (HMAC with SHA-384) - Symmetric, requires shared secret
    | - HS512 (HMAC with SHA-512) - Symmetric, requires shared secret
    | - RS256 (RSA with SHA-256) - Asymmetric, requires private/public key pair
    |
    | Default: HS256 (recommended for most use cases)
    |
    */

    'algorithm' => env('JWT_ALGORITHM', 'HS256'),

    /*
    |--------------------------------------------------------------------------
    | Access Token TTL (Time To Live)
    |--------------------------------------------------------------------------
    |
    | The number of seconds that an access token is valid. After this time,
    | the token will expire and a new one must be obtained using a refresh token.
    |
    | Default: 3600 seconds (1 hour)
    | Recommended: 900-3600 seconds (15 minutes to 1 hour)
    |
    */

    'access_token_ttl' => (int) env('JWT_ACCESS_TOKEN_TTL', 3600),

    /*
    |--------------------------------------------------------------------------
    | Refresh Token TTL (Time To Live)
    |--------------------------------------------------------------------------
    |
    | The number of seconds that a refresh token is valid. After this time,
    | the user must re-authenticate with their credentials.
    |
    | Default: 2592000 seconds (30 days)
    | Recommended: 604800-2592000 seconds (7 to 30 days)
    |
    */

    'refresh_token_ttl' => (int) env('JWT_REFRESH_TOKEN_TTL', 2592000),

    /*
    |--------------------------------------------------------------------------
    | JWT Issuer
    |--------------------------------------------------------------------------
    |
    | The "iss" (issuer) claim identifies the principal that issued the JWT.
    | This is typically your application's URL.
    |
    */

    'issuer' => env('JWT_ISSUER', env('APP_URL', 'http://localhost')),

    /*
    |--------------------------------------------------------------------------
    | JWT Audience
    |--------------------------------------------------------------------------
    |
    | The "aud" (audience) claim identifies the recipients that the JWT is
    | intended for. This is typically your frontend application URLs.
    |
    */

    'audience' => array_filter(
        array_map('trim', explode(',', env('JWT_AUDIENCE', env('FRONTEND_URL', 'http://localhost:3000'))))
    ),

    /*
    |--------------------------------------------------------------------------
    | Leeway
    |--------------------------------------------------------------------------
    |
    | This value (in seconds) is used to account for clock skew between
    | different servers. It provides a grace period for token validation.
    |
    | Default: 60 seconds
    |
    */

    'leeway' => (int) env('JWT_LEEWAY', 60),

    /*
    |--------------------------------------------------------------------------
    | Blacklist Enabled
    |--------------------------------------------------------------------------
    |
    | Enable or disable token blacklisting. When enabled, refresh tokens
    | can be invalidated (e.g., on logout). Requires blacklist storage.
    |
    */

    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Blacklist Grace Period
    |--------------------------------------------------------------------------
    |
    | The grace period (in seconds) for blacklisted tokens. This allows
    | a token to be used for a short time after being blacklisted to
    | handle race conditions in distributed systems.
    |
    | Default: 0 seconds (no grace period)
    |
    */

    'blacklist_grace_period' => (int) env('JWT_BLACKLIST_GRACE_PERIOD', 0),

];
