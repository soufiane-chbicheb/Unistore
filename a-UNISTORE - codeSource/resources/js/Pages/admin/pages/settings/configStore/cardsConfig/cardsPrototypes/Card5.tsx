import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import ProductImageSlideshow from "@/components/partials/ProductImageSlideshow";
import { Star, Eye, ShoppingBag } from "lucide-react";
import { usePage } from "@inertiajs/react";

// Card 7: Featured Big
export const Card5: React.FC<any> = ({ product, onAddToCart, onViewDetails }) => {
      const {state :{currentCardConf :{isRounded , showPrice , showRating , showBorder}} } = useStoreConfigCtx()
      const { storeCurrency } = usePage().props as any;
    
    return (
        <div 
          className={`bg-white h-full flex flex-col rounded-none cursor-pointer group ${showBorder ? 'border border-slate-900' : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border border-slate-900'}`}
          onClick={onViewDetails}
        >
             <div className="p-3 border-b border-slate-900 flex justify-between items-center bg-slate-100">
                <span className="text-xs font-black uppercase tracking-widest">New Arrival</span>
                {showRating && <div className="flex text-xs font-bold items-center"><Star className="w-3 h-3 fill-black text-black mr-1"/> {product.rating}</div>}
             </div>
             <div className="aspect-[5/4] relative overflow-hidden group border-b border-slate-900">
                 <ProductImageSlideshow 
                    images={product.images || [product.image]} 
                    alt={product.name} 
                    className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" 
                    productId={product.id}
                 />
                 <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      className="bg-white border-2 border-slate-900 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-500 hover:text-white transition-all active:translate-y-1 active:shadow-none"
                      onClick={(e) => { e.stopPropagation(); onViewDetails(e); }}
                    >
                      <Eye className="w-6 h-6" />
                    </button>
                    <button 
                      className="bg-white border-2 border-slate-900 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-500 hover:text-white transition-all active:translate-y-1 active:shadow-none"
                      onClick={onAddToCart}
                    >
                      <ShoppingBag className="w-6 h-6" />
                    </button>
                 </div>
             </div>
             <div className="p-5 bg-white flex flex-col gap-4">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight line-clamp-2 mb-1">{product.name}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase">{product.brand}</p>
                 </div>
                 
                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    {showPrice && <span className="text-2xl font-black">{product.price} {storeCurrency}</span>}
                    <button 
                      className="bg-slate-900 text-white px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-orange-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
                      onClick={onAddToCart}
                    >
                        Add to Bag
                    </button>
                 </div>
             </div>
        </div>
    );
}
