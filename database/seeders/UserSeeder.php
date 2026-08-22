<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Seeder;


class UserSeeder extends Seeder{

    public function run()
    {
        $storeId = Store::first()->id;

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        User::query()->delete();
        \App\Models\Role::query()->delete();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // Ensure roles exist with verb-based claims
        $superAdminRole = \App\Models\Role::updateOrCreate(
            ['name' => 'super_admin'],
            ['claims' => [
                'manages-products', 'manages-orders', 'manages-customers', 
                'views-reports', 'manages-settings', 'manages-roles', 
                'manages-banners', 'manages-collections'
            ]]
        );

        $adminRole = \App\Models\Role::updateOrCreate(
            ['name' => 'admin'],
            ['claims' => [
                'manages-products', 'manages-orders', 'manages-customers', 
                'views-reports', 'manages-banners', 'manages-collections'
            ]]
        );

        $managerRole = \App\Models\Role::updateOrCreate(
            ['name' => 'manager'],
            ['claims' => [
                'manages-products', 'manages-orders', 'manages-customers', 'views-reports'
            ]]
        );

        \App\Models\Role::firstOrCreate(['name' => 'user'], ['claims' => []]);

        // Create the specific admin user
        $admin = User::firstOrCreate(
            ['email' => 'soufianechbicheb@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'email_verified_at' => now(),
                'store_id' => $storeId,
            ]
        );

        // Assign admin role if not already assigned
        if (!$admin->roles()->where('name', 'admin')->exists()) {
            $admin->roles()->attach($adminRole);
        }

        User::factory()->count(10)->create(['store_id' => $storeId]);
    }

     
}