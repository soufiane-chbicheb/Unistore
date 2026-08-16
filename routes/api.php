<?php
//file name routes/ajax 

use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::get('/tags/suggest', [TagController::class, 'suggest'])->name('tags.suggest');
Route::get('/products/suggest', [ProductController::class, 'suggest'])->name('products.suggest');
//web hook

Route::post('api/webhook/stripe', [StripeWebhookController::class, 'handle']);


Route::match(['get', 'post'], '/shipping/calculate/{name}', [ShippingController::class, 'calculate'])->name('shipping.calculate');

// Route removed: shipping.calculateBestRewardForUser is already in web.php under tenant group
