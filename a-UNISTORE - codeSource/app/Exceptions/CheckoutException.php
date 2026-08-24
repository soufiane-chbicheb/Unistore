<?php

namespace App\Exceptions;

use Exception;

class CheckoutException extends \RuntimeException
{
    /**
     * Create a new class instance.
     */
    public function __construct($message)
    {
        parent::__construct($message);
    }
}
