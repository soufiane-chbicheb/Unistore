import { Link, usePage } from "@inertiajs/react";
import { X } from "lucide-react";

function CartSideBar({cartItems , onClose , total}:{cartItems:any ;  onClose : any  ;  total : any }) {
    const { storeCurrency } = usePage().props as any;
   
    return ( 
      
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {cartItems.map((item : any) => {
                  const product = item.product_variant?.product;
                  const image = product?.thumbnail?.url || "/placeholder-product.png";
                  const name = product?.name || "Product";
                  const price = item.price_snapshot || 0;

                  return (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={image}
                        alt={name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
                        <p className="text-sm text-gray-600">{item.quantity} x {Number(price).toFixed(2)} {storeCurrency}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-6 border-t">
                <div className="text-lg font-semibold text-gray-900 mb-4">
                  Total: {total.toFixed(2)} {storeCurrency}
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors">
                    <Link href={'/cart'}>View Cart</Link>
                  </button>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

}
export default CartSideBar ;
