<?php

namespace App\Http\Controllers;

use App\Actions\OrderAction;
use App\Context\Order\CheckoutContext;
use App\Context\Order\SingleOrderContext;
use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\CheckoutException;
use App\Exceptions\StockException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CheckoutOrderRequest;
use App\Http\Requests\Order\SingleOrderRequest;
use App\Models\GoogleSheet;
use App\Models\Order;
use App\Services\CartService;
use App\Services\DTOService;
use App\Services\OrderService;
use App\Services\ShippingService;
use App\Services\StockService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    
    public function __construct(
        private OrderService $orderService , 
        private ShippingService $shippingService , 
        private StockService $stockService ,
        private DTOService $dtoService ,
    ) {}
    
    public function index($tenant) {
        $sheet = GoogleSheet::where('key', 'orders')->first();
        return Inertia::render('admin/pages/orders/OrderManager' ,
        [

            'statistics' => $this->orderService->getStats() ,
            'orders' => $this->orderService->getOrders() ,
            'sheetUrl' => $sheet?->spreadsheet_url,
        ]
        ) ;

    }

   
    public function store($tenant, SingleOrderRequest $request , OrderAction $action)
    {   
         try {
         if ($request->payment_method === 'CARD' && !Auth::check()) {
            return back()->withErrors(['submit' => 'Login required for card payment']);
         }
         $user = Auth::user();
         $clientItemsParams = collect($request->validated('items')) ;
         $items = $this->stockService->getSingleOrderItems($clientItemsParams->pluck('variant_id')->toArray());
         $this->stockService->validateFromStore( $items ,$clientItemsParams);
         $itemsMatchToCheckoutDto = $this->dtoService->prepareItemsToMatchCheckoutItemDTO($items ,$clientItemsParams);
         $dto = CreateOrderDTO::fromRequest(array_merge($request->validated() , ['items' => $itemsMatchToCheckoutDto]) , $user);
         $context = new SingleOrderContext($dto , $user);
        
         $result = $action->execute($context);
         
        if(isset($result['client_secret'])){ // auth => card
                    return back()->with([
                        'client_secret' => $result['client_secret'],
                        'order_id'      => $result['order_id'],
                    ]);
            }
        elseif(isset($result["tracking_token"])){ // guest
                        return redirect()
                        ->route('track.guest' , $result["tracking_token"])
                        ->with('success', 'Order placed successfully!');
            }
        else{ // auth => cod 
                    return redirect()
                        ->route('track.auth' , $result["order_id"])
                        ->with('success', 'Order placed successfully!');
             }
         }
         catch (ValidationException $e) {
                         return back()->withErrors( $e->errors())->withInput();
         }
         catch (StockException $e) {
                         return back()->withErrors(['submit' => $e->getMessage()]);
         }
         catch (Exception $e) {
                         return back()->withErrors(['submit' => $e->getMessage()]);
         }

    }


    public function checkout($tenant, CheckoutOrderRequest $request , OrderAction $action , CartService $cartService)
    
    {
        try{
                if ($request->payment_method === 'CARD' && !Auth::check()) {
                        return back()->withErrors([
                            'submit' => 'You must be logged in to pay by card'
                        ]);
                }

                $user = Auth::user();

                $cartItems = $cartService->getCartItems(true);

                // Validate cart not empty
                if (is_null($cartItems) || $cartItems->isEmpty()) {
                    throw new CheckoutException('Your cart is empty');
                }
               
                
                // validate stock
                $this->stockService->validateFromCheckout($cartItems) ;
            

                // dto object
                $dto = CreateOrderDTO::fromRequest(
                    array_merge($request->validated() , ['items' => $cartItems->toArray()]) ,
                    $user
                );
                $context = new CheckoutContext($dto , $user) ;

                $result = $action->execute($context);
                if(isset($result['client_secret'])){ // hes is auth already + payment 

                     return back()->with([
                        'client_secret' => $result['client_secret'],
                        'order_id'      => $result['order_id'],
                     ]);
                }
                elseif(isset($result["tracking_token"])){//he is a guest 
                        return redirect()
                        ->route('track.guest' , $result["tracking_token"])
                        ->with('success', 'Order placed successfully!');
                }else{ // auth + cod 
                    return redirect()
                        ->route('track.auth' , $result["order_id"])
                        ->with('success', 'Order placed successfully!');
                }


        }catch(ValidationException $e){
             return back()->withErrors( $e->errors())->withInput();
            
        }
        catch(Exception $e){
             return back()->withErrors(['submit' => $e->getMessage()]);
        }
    }

    public function authTrack($tenant, Order $order){

          if(Auth::id() !== $order->user_id){
               abort(403);
          }
 
       return  $this->renderTrackOrder($order);
    }

    
    public function guestTrack($tenant, string $token){
        if(Auth::check()){
              return redirect()->route('orders.index')->with('message', 'Please use your account to track orders');
        }
        $order = Order::whereNull('user_id')
            ->where('tracking_token', $token)
            ->with(['items', 'address'])
            ->firstOrFail();

         return  $this->renderTrackOrder($order);

    }

    private function renderTrackOrder(Order $order){

        $order->load(['items','address' , 'coupon:id,code']);
        $order->address->makeHidden(['created_at', 'updated_at', 'order_id']);
        $order->items->makeHidden(['created_at' , 'updated_at']);
        $shipping = $this->shippingService->getZoneShippingInfo($order->address->city);

        return Inertia::render('orders/OrderTrack' , [
            'order' => $order->makeHidden(['paid_at' , 'paid']) ,
            'shipping' => $shipping
        ]);
    }

    public function destroy($tenant, Order $order)
    {
        abort_if(Auth::id() !== $order->user_id, 403);
        $order->delete();
    }


   

   

    
}
