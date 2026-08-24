<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name', 'claims'];

    protected $casts = [
        'claims' => 'array',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
