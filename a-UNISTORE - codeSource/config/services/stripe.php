<?php

return [
    "secret"=> env('STRIPE_SECRET_KEY'),
    "key"=> env('STRIPE_PUBLISHABLE_KEY'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET')
];