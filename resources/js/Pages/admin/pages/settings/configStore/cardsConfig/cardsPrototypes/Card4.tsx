import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import ProductImageSlideshow from "@/components/partials/ProductImageSlideshow";
import { ProductClient } from "@/types/clientSideTypes";
import { Heart, Star, Eye } from "lucide-react";
import { usePage } from "@inertiajs/react";

// Card 4: Overlay Card
const Card4 = ({ product, onAddToCart, onViewDetails }:{product : any, onAddToCart: any, onViewDetails: any}) => {
    const {state :{currentCardConf :{isRounded , showPrice , showRating , showBorder}} } = useStoreConfigCtx()
    const { storeCurrency } = usePage().props as any;

  return (
    <div 
      className={`relative rounded-xl overflow-hidden group cursor-pointer ${showBorder ? 'border-2 border-gray-300' : ''}`}
      onClick={onViewDetails}
    >
      <ProductImageSlideshow 
        images={product.images || [product.image]} 
        alt={product.name} 
        className="w-full h-64 transition-transform duration-500 group-hover:scale-105" 
        productId={product.id}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 pointer-events-none">
        <div className="pointer-events-auto">
            <h3 className="font-bold text-white text-lg mb-1">{product.name}</h3>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {showPrice && (
                <span className="text-white font-semibold text-lg">{product.price} {storeCurrency}</span>
                )}
                {showRating && (
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-sm">{product.rating}</span>
                </div>
                )}
            </div>
            <div className="flex gap-2">
                <button 
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-orange-500 hover:text-white transition-all"
                  onClick={(e) => { e.stopPropagation(); onViewDetails(e); }}
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                  onClick={(e) => { e.stopPropagation(); /* Wishlist */ }}
                >
                  <Heart className="w-5 h-5 text-white" />
                </button>
                <button 
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-500 hover:text-white transition-all"
                  onClick={onAddToCart}
                >
                  Add
                </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Card4;
