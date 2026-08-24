import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import ProductImageSlideshow from "@/components/partials/ProductImageSlideshow";
import { ProductClient } from "@/types/clientSideTypes";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { usePage } from "@inertiajs/react";

// Card 3: Premium Card
const Card3 = ({ product, onAddToCart, onViewDetails }:{product : any, onAddToCart: any, onViewDetails: any}) => {
  const {state :{currentCardConf :{isRounded , showPrice , showRating , showBorder}} } = useStoreConfigCtx()
  const { storeCurrency } = usePage().props as any;

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl ${showBorder ? 'border-4 border-purple-200' : 'shadow-xl'}`}
      onClick={onViewDetails}
    >
      <div className="relative group">
        <ProductImageSlideshow 
          images={product.images || [product.image]} 
          alt={product.name} 
          className="w-full h-52" 
          productId={product.id}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all"
            onClick={(e) => { e.stopPropagation(); onViewDetails(e); }}
          >
            <Eye className="w-6 h-6" />
          </button>
          <button 
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all"
            onClick={onAddToCart}
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
        <button 
          className="absolute top-3 left-3 bg-purple-600 rounded-full p-2 hover:bg-purple-700 text-white"
          onClick={(e) => { e.stopPropagation(); /* Wishlist */ }}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-gray-800">{product.name}</h3>
          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded uppercase">Premium</span>
        </div>
        {showRating && (
          <div className="flex items-center gap-1 mb-4">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-700">{product.rating}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {showPrice && (
            <span className="text-2xl font-black text-purple-600">{product.price} {storeCurrency}</span>
          )}
          <button 
            className="bg-gray-900 text-white p-3 rounded-xl hover:bg-purple-600 transition-colors"
            onClick={onAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card3;
