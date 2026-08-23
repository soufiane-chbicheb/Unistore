<?php

namespace Database\Seeders;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderAddress;
use App\Models\Store;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run()
    {        
            $storeId = Store::inRandomOrder()->first()->id;

            \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
            OrderItem::query()->delete();
            OrderAddress::query()->delete();
            Order::query()->delete();
            \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

            Order::factory(12)->create(['store_id' => $storeId])->each(function ($order) {

            // 1️⃣ Create items
            $itemsCount = rand(1, 4); // single product OR checkout
            $items = OrderItem::factory($itemsCount)->make();

            $subtotal = 0;

            foreach ($items as $item) {
                $item->order_id = $order->id;
                $item->save();

                $subtotal += $item->price * $item->quantity;
            }
    
            // 2️⃣ Create addresses
            OrderAddress::factory()->create([
                'order_id' => $order->id,
                'type' => 'shipping',
            ]);

            OrderAddress::factory()->create([
                'order_id' => $order->id,
                'type' => 'billing',
            ]);

            // 3️⃣ Calculate total
            $total =
                $subtotal +
                $order->tax +
                ($order->shipping_cost ?? 0) -
                ($order->discount_amount ?? 0);

            $order->update([
                'total_amount' => max($total, 0),
            ]);
        });
    }
}
