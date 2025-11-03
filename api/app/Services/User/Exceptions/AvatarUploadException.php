<?php

namespace App\Services\User\Exceptions;

use Exception;

class AvatarUploadException extends Exception
{
    public static function storageError(string $message = ''): self
    {
        $errorMessage = 'Failed to upload avatar';
        if ($message) {
            $errorMessage .= ': '.$message;
        }

        return new self($errorMessage);
    }
}
