<?php

namespace App\Enums;

enum PaginationEnum
{
    case DEFAULT_PAGINATION;

    public function value(): int
    {
        return app()->environment('production') ? 30 : 3;
    }
}
