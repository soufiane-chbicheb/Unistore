<?php

namespace App\Exceptions;

class CouponException extends \Exception
{
    /**
     * Create a new class instance.
     */
    public function __construct($message)
    {
        Parent::__construct($message);
    }
}
