import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import ProductImageSlideshow from "@/components/partials/ProductImageSlideshow";
import { Eye, Heart, ShoppingCart, Star, Check } from "lucide-react";
import { usePage } from "@inertiajs/react";

// Card 2: Horizontal Card
const Card2 = ({ product, onAddToCart, onViewDetails }:{product : any, onAddToCart: any, onViewDetails: any}) => {
     const {state :{currentCardConf :{isRounded , showPrice , showRating , showBorder}} } = useStoreConfigCtx()
     const { storeCurrency } = usePage().props as any;

  if(!product ) return null
  return (
      <div key={product.id} className="group cursor-pointer" onClick={onViewDetails}>
                <div className={`relative overflow-hidden rounded-lg bg-gray-100 mb-4 ${showBorder ? 'border-2 border-gray-300' : ''}`} >
                  <ProductImageSlideshow 
                    images={product.images || [product.image]} 
                    alt={product.name ?? 'image'} 
                    className="w-full h-80 transition-transform duration-500 group-hover:scale-110" 
                    productId={product.id}
                  />
                  
                  {/* Product Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      className="p-2 bg-white rounded-full shadow-md hover:bg-orange-500 hover:text-white transition-colors"
                      onClick={(e) => { e.stopPropagation(); /* Wishlist */ }}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 bg-white rounded-full shadow-md hover:bg-orange-500 hover:text-white transition-colors"
                      onClick={onViewDetails}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 bg-white rounded-full shadow-md hover:bg-orange-500 hover:text-white transition-colors"
                      onClick={onAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{product?.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 uppercase tracking-tight">{product?.brand}</p>
                  
                  {/* Rating & Sold */}
                  <div className="flex items-center justify-between">
                    {showRating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-orange-400 fill-current" />
                        <span className="text-sm font-bold text-slate-700">{product?.rating ?? '0.0'}</span>
                      </div>
                    )}
                    <span className="text-xs font-medium text-slate-500">Sold {product?.sold_count ?? 0}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {showPrice && (
                      <p className="text-lg font-black text-slate-900">{product?.price ?? '0.00'} {storeCurrency}</p>
                    )}
                    {product?.is_verified && (
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter border border-blue-100">
                        <Check className="w-2.5 h-2.5" />
                        Verified
                      </div>
                    )}
                  </div>
                  </div>
      </div>
  );
};


export default Card2;   
