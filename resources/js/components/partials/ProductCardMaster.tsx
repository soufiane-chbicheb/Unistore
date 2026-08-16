import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx'
import Card1 from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card1'
import Card2 from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card2'
import Card3 from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card3'
import Card4 from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card4'
import { Card5 } from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card5'
import { Card6 } from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card6'
import { ProductClient } from '@/types/clientSideTypes'
import {  CardOption } from '@/types/StoreConfigTypes'
import { router } from '@inertiajs/react'
import { useToast } from '@/contextHooks/useToasts'
import { route } from 'ziggy-js'

export default function ProductCardMaster({product}:{product : any}) {
  const {state : {currentCardConf}} = useStoreConfigCtx()
  const { cardId } = currentCardConf;
  const { addToast } = useToast()

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const variantId = product.variant_id || product.variants?.[0]?.variant_id || product.variants?.[0]?.id;

    if (!variantId) {
      addToast({
        type: 'error',
        title: 'Selection Error',
        description: 'No product variant found'
      });
      return;
    }

    router.post(route('cart.store'), { 
      product_id: product.id,
      variant_id: variantId,
      quantity: 1 
    }, {
      preserveScroll: true,
      onSuccess: () => {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Added to your bag'
        });
      },
      onError: (errors) => {
        addToast({
          type: 'error',
          title: 'Bag Error',
          description: errors.error || 'Please login to add items to your cart.'
        });
      }
    });
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    router.get(route('product.show', { product: product.slug || product.id }));
  };

  const cardsMap : Record<CardOption , any>  =  {
    'card-1'  : Card1 ,
    'card-2'  : Card2 , 
    'card-3'  : Card3 , 
    'card-4'  : Card4 , 
    'card-5'  : Card5 , 
    'card-6'  : Card6
  }

  const Card = cardsMap[cardId] ;
  
  return (
    <div className="h-full">
      <Card 
        product={product} 
        config={currentCardConf}
        onAddToCart={handleAddToCart} 
        onViewDetails={handleViewDetails} 
      />
    </div>
  )
}
