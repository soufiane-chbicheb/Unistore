<?php

namespace App\Context\Order;

use App\DTOs\Order\CreateOrderDTO;
use App\Models\User;

class CheckoutContext
{
    /**
     * Create a new class instance.
     */
    public function __construct(public CreateOrderDTO $dto ,
                               public ?User $user
    )
    {
    }
}
