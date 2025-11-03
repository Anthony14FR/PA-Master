<?php

namespace App\Services\User\Exceptions;

use Exception;

class UserHasActiveBookingsException extends Exception
{
    public static function cannotDeleteAccount(): self
    {
        return new self('Cannot delete account with active bookings');
    }
}
