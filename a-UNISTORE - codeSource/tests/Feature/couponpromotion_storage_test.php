<?php

use App\Http\Controllers\Admin\CouponController;
use App\Http\Requests\Admin\CouponRequest;
use App\Http\Requests\Admin\PromotionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

define('LARAVEL_START', microtime(true));

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

function testCoupon($app) {
    echo "Testing Coupon Storage...\n";
    $payload = [
        'code' => 'TEST_COUPON_' . time(),
        'description' => 'Test Coupon Description',
        'type' => 'percentage',
        'value' => 15.50,
        'minimum_order_amount' => 100,
        'minimum_items' => 2,
        'max_uses' => 100,
        'max_uses_per_user' => 1,
        'valid_from' => date('Y-m-d H:i:s'),
        'valid_until' => date('Y-m-d H:i:s', strtotime('+1 week')),
        'is_active' => true,
        'applicable_product_ids' => [62, 63],
        'applicable_category_ids' => [66],
        'applicable_sub_category_ids' => [],
    ];

    $couponRequest = CouponRequest::create('/admin/coupons', 'POST', $payload);
    $couponRequest->setContainer($app)->setRedirector($app->make('redirect'));

    $validator = Validator::make($payload, $couponRequest->rules());
    if ($validator->fails()) {
        echo "Validation Failed: " . json_encode($validator->errors()->toArray(), JSON_PRETTY_PRINT) . "\n";
        return;
    }

    // Set the validator on the request so validated() works
    $couponRequest->setValidator($validator);

    try {
        $controller = $app->make(CouponController::class);
        $response = $controller->store($couponRequest);
        echo "Response Status: " . $response->getStatusCode() . "\n";
        if ($response->getStatusCode() == 302) {
            echo "Success! Redirected to: " . $response->headers->get('Location') . "\n";
            // Verify in DB
            $coupon = \App\Models\Coupon::where('code', $payload['code'])->first();
            if ($coupon) {
                echo "Verified in DB: " . $coupon->code . " with " . count($coupon->applicable_product_ids) . " products.\n";
            } else {
                echo "Verification Failed: Coupon not found in DB.\n";
            }
        }
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}

function testPromotion($app) {
    echo "\nTesting Promotion Storage...\n";
    $payload = [
        'name' => 'Test Promotion ' . time(),
        'type' => 'fixed',
        'value' => 50.00,
        'minimum_order_amount' => 500,
        'minimum_items' => 1,
        'max_uses' => null,
        'valid_from' => date('Y-m-d H:i:s'),
        'valid_until' => date('Y-m-d H:i:s', strtotime('+1 month')),
        'is_active' => true,
        'priority' => 10,
        'applicable_product_ids' => [62],
        'applicable_category_ids' => [],
        'applicable_sub_category_ids' => [],
    ];

    $promotionRequest = PromotionRequest::create('/admin/promotions', 'POST', $payload);
    $promotionRequest->setContainer($app)->setRedirector($app->make('redirect'));

    $validator = Validator::make($payload, $promotionRequest->rules());
    if ($validator->fails()) {
        echo "Validation Failed: " . json_encode($validator->errors()->toArray(), JSON_PRETTY_PRINT) . "\n";
        return;
    }

    // Set the validator on the request so validated() works
    $promotionRequest->setValidator($validator);

    try {
        $controller = $app->make(\App\Http\Controllers\Admin\PromotionController::class);
        $response = $controller->store($promotionRequest);
        echo "Response Status: " . $response->getStatusCode() . "\n";
        if ($response->getStatusCode() == 302) {
            echo "Success! Redirected to: " . $response->headers->get('Location') . "\n";
            // Verify in DB
            $promotion = \App\Models\Promotion::where('name', $payload['name'])->first();
            if ($promotion) {
                echo "Verified in DB: " . $promotion->name . " with " . count($promotion->applicable_product_ids) . " products.\n";
            } else {
                echo "Verification Failed: Promotion not found in DB.\n";
            }
        }
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}

testCoupon($app);
testPromotion($app);
