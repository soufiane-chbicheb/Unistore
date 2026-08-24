<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserLogin 
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $type;
    public $user;
    public $remember;

    /**
     * Create a new event instance.
     */
    public function __construct($type = null, $user = null, $remember = false)
    {
        $this->type = $type;
        $this->user = $user;
        $this->remember = $remember;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
