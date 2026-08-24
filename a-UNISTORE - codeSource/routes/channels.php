<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders.{id}', function ($user, $id) {
    return (int) $user->id === (int) \App\Models\Order::find($id)?->user_id;
});
