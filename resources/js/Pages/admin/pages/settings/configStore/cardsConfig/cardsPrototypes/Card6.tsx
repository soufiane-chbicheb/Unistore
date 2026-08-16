import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import ProductImageSlideshow from "@/components/partials/ProductImageSlideshow";
import { ProductClient } from "@/types/clientSideTypes";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { usePage } from "@inertiajs/react";

// Card 4: Overlay Card
export const Card6 = ({ product, onAddToCart, onViewDetails }:{product:any, onAddToCart: any, onViewDetails: any}) => {
    const {state :{currentCardConf :{isRounded , showPrice , showRating , showBorder}} } = useStoreConfigCtx()
    const { storeCurrency } = usePage().props as any;

  return (
    <div 
      className={`relative rounded-xl overflow-hidden group h-full aspect-[4/5] cursor-pointer ${showBorder ? 'border-2 border-slate-300' : 'shadow-lg'}`}
      onClick={onViewDetails}
    >
      <ProductImageSlideshow 
        images={product.images || [product.image]} 
        alt={product.name} 
        className="w-full h-full transition-transform duration-700 group-hover:scale-110" 
        productId={product.id}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 pointer-events-none">
        <div className="pointer-events-auto">
            <h3 className="font-bold text-white text-xl mb-2">{product.name}</h3>
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    {showPrice && (
                        <span className="text-white font-semibold text-lg">{product.price} {storeCurrency}</span>
                    )}
                    {showRating && (
                        <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-white text-xs font-medium">{product.rating}</span>
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="flex-1 bg-white text-black py-2.5 rounded-lg text-sm font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    onClick={onAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                  </button>
                  <button 
                    className="bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-lg hover:bg-white hover:text-black transition-all"
                    onClick={(e) => { e.stopPropagation(); onViewDetails(e); }}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
