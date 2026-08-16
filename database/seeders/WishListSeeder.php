<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use App\Models\WishList;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WishListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all()->random(3);
        $products = Product::all();
        foreach ($users as $user) {
            $randomproducts = $products->random(3);

            foreach ($randomproducts as $randomproduct) {
                // WishList::upsert([
                //     "user_id" => $user->id,
                //     "product_id" => $randomproduct->id,
                // ],
                // ['user_id' , 'product_id'],[]  );
                try {
                    WishList::create([
                        'user_id' => $user->id,
                        'product_id' => $randomproduct->id,
                    ]);
                } catch (\Illuminate\Database\QueryException $e) {
                    // 23000 is SQLSTATE code for integrity constraint violation
                    if ($e->getCode() === '23000') {
                        $this->command->warn("Duplicate detected for user {$user->id} and product {$randomproduct->id}");
                    } else {
                        throw $e; 
                    }
                }
            }
        }
    }
}
