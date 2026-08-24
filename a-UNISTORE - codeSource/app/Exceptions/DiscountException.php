<?php

namespace App\Exceptions;

use Exception;

class DiscountException  extends Exception
{
    /**
     * Create a new class instance.
     */
    public function __construct($message)
    {
           parent::__construct($message);
    }
}
