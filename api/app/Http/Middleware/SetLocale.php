<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $availableLocales = explode(',', config('app.available_locales', 'en'));
        $defaultLocale = config('app.locale', 'en');

        $acceptLanguage = $request->header('Accept-Language');
        $locale = $this->parseAcceptLanguage($acceptLanguage, $availableLocales, $defaultLocale);

        App::setLocale($locale);

        if ($request->user()) {
            $userLocale = $request->user()->locale ?? $defaultLocale;
            if ($userLocale !== $locale) {
                \Log::info('Locale mismatch for user', [
                    'user_id' => $request->user()->id,
                    'user_locale' => $userLocale,
                    'request_locale' => $locale,
                    'accept_language' => $acceptLanguage,
                ]);
            }
        }

        return $next($request);
    }

    private function parseAcceptLanguage(?string $acceptLanguage, array $availableLocales, string $defaultLocale): string
    {
        if (! $acceptLanguage) {
            return $defaultLocale;
        }

        $locale = trim(strtok($acceptLanguage, ',;'));

        if (strlen($locale) > 2) {
            $locale = substr($locale, 0, 2);
        }

        return in_array($locale, $availableLocales) ? $locale : $defaultLocale;
    }
}
