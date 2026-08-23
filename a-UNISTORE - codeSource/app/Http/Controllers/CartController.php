<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\ShippingZone;
use App\Services\CartService;
use App\Services\ShippingService;
use App\Services\StoreSettingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CartController extends Controller
{
    
    public function __construct(
        private CartService $cartService , 
      private ShippingService $shippingService , 
      private StoreSettingService $storeSettingsService) {}

    public function index()
    {
        $items = $this->cartService->getCartItems(false);
        $defaultShippingAmount = $this->shippingService->avgShippingCost();
        
        return Inertia::render('cart/ShoppingCartMaster', [
              'items' => CartResource::collection($items),
              'currency' =>  $this->storeSettingsService->getStoreCurrency() , 
              'defaultShippingAmount' => $defaultShippingAmount
              ]
            
            );
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'integer|min:1'
        ]);

        try {
            $this->cartService->addToCart($request->all());
            return back()->with('success', 'Product added to cart');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update($tenant, Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::findOrFail($id);
        $cart->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Cart updated');
    }

    public function clear($tenant)
    {
        $this->cartService->clearCart();
        return back()->with('success', 'Cart cleared successfully');
    }

    public function destroy($tenant, $id)
    {
        Cart::destroy($id);
        return back()->with('success', 'Item removed from cart');
    }

}
