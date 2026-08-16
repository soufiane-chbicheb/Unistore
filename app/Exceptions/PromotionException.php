<?php

namespace App\Exceptions;

class PromotionException extends \Exception
{
    /**
     * Create a new class instance.
     */
    public function __construct($message)
    {
        parent::__construct($message);
    }
}
