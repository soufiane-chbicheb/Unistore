<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, \App\Traits\BelongsToStore;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',          // Add
        'google_token',       // Add
        'google_refresh_token', // Add
        'store_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function wishListItems(){
         return $this->hasMany(WishList::class);
     }
    
    public function cartItems(){
        return $this->hasMany(Cart::class);
     }

    
    public function orders(){
        return $this->hasMany(Order::class);
    }
    
    
    public function avatar(){
         return $this->morphOne(Media::class , 'mediaable')
            ->where("collection" , "avatar")
         ;
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('name', $role);
        }

        if ($role instanceof Role) {
            return $this->roles->contains('id', $role->id);
        }

        if (is_array($role)) {
            return $this->roles->pluck('name')->intersect($role)->isNotEmpty();
        }

        return false;
    }

    public function hasPermission($permission)
    {
        // Check if user is Admin (god mode)
        if ($this->hasRole('Admin')) {
            return true;
        }

        return $this->roles->contains(function ($role) use ($permission) {
            return is_array($role->claims) && in_array($permission, $role->claims);
        });
    }
}
