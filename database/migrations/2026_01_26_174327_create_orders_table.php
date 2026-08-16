<?php

use App\Models\Address;
use App\Models\Coupon;
use App\Models\Product;


use App\Models\User;
use App\Models\OrderAddress;
use App\Models\Promotion;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignIdFor(User::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Coupon::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Promotion::class)->nullable()->constrained()->nullOnDelete();

            
            // statu'
            $table->enum('payment_status', ['pending', 'paid', 'failed' ])
              ->default('pending') ;
    

            $table->enum('order_status', ['pending', 'confirmed', 'cancelled' , 'out_for_delivery','delivery_failed' , 'delivered' , 'returned'])
                ->default('pending') ;

            // idempotent counter updates
            $table->boolean('coupon_counted')
              ->default(false) ;


             $table->boolean('promotion_counted')
              ->default(false);
             // end idempotent counter updates

            $table->decimal('tax', 10, 2)->default(0);
            $table->string('currency', 3)->default('MAD'); // always store the currency
            $table->enum('payment_method', ['cod', 'card', 'paypal'])->default('cod');
            $table->string('tracking_token', 64)->unique()->nullable();
            $table->string('payment_id')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->float('shipping_cost')->unsigned()->nullable();
            $table->float('discount_amount')->unsigned()->nullable();
            $table->float('total_amount')->unsigned();
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->index('coupon_counted');
            $table->index('promotion_counted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
