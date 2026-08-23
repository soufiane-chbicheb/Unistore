import { ProductSchemaType } from '@/shemas/productSchema'
import { PageProps as InertiaPageProps } from '@inertiajs/core'
import { Config, RouteName, RouteParams } from 'ziggy-js'

declare global {
    var route: ((
        name?: RouteName,
        params?: RouteParams<RouteName>,
        absolute?: boolean,
        config?: Config
    ) => string) & {
        current: (name?: string, params?: RouteParams<RouteName>) => boolean;
    };
}


interface Media {
  id: string;
  url: string;
  collection: string;
}

interface Draft {
  id:number;
  name: string;
  brand?: string;
  nichCategory?: { id: number; name: string } | null;
  thumbnail?: Media | null;
  updated_at: string;
  quality_score: number;
  ready_to_publish: boolean;
  variants?: Variant[];
  description?: string;
  tags?: string[];
  covers?: Media[];

  
}


type Review = {
  id: number
  author: string
  rating: number        
  body: string
  created_at: string
  variant_label?: string  
  photos?: string[]
}

type RatingBreakdown = {
  1: number
  2: number
  3: number
  4: number
  5: number
}


type Shipping = {
  isReturnable: boolean
  returnPolicy: string
  returnWindow: number
  shippingClass: string
  shippingCostOverride: number
}

// ─── Promotion ───────────────────────────────
type Promotion = {
  id: number
  name: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  valid_until: string | null
  minimum_order_amount: number | null
}

type Badge = {
  id: number
  name: string
  color: string
  icon: string
}


type  ProductDetailType = Omit<ProductSchemaType , 'badge' , 'shipping' , 'vendor'> & {
      nich_category : string , 
      rating_average: number | null
      rating_count: number
      rating_breakdown: RatingBreakdown
      reviews: Review[]
      badge: Badge | null
      promotions: Promotion[] 

}
declare module '@inertiajs/core' {
 interface PageProps extends InertiaPageProps {
        flash: {
            success: string | null
            error:   string | null
        }
        auth: {
            user: {
                id:    number
                name:  string
                email: string
            }
        },
        product : ProductDetailType
        drafts : Draft[] , 
    }
}

