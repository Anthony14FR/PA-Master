<?php

namespace App\Enums;

enum ApiStatus: string
{
    case SUCCESS = 'success';
    case ERROR = 'error';
}