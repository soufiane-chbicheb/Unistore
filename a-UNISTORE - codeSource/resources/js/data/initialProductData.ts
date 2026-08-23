import { ProductSchemaType } from "@/shemas/productSchema";
import { Category, Cover} from "@/types/inventoryTypes";
import { Tag } from "@/types/tagsTypes";
import { video } from "framer-motion/client";


export const getEmptyInitialProductData = () => { // for create new product
   // Base attributes shared by all niches
const baseProductData : ProductSchemaType = {
  category_niche_id : undefined, 
  id: undefined,
  name: "",
  brand: "", 
  is_visible : true ,
  sub_categories: [] as Category[],
  description: "",
  rating_average: undefined,
  price : null, 
  sku : null ,
  compare_price : null , 
  stock : null ,
  madeCountry :  '' , 
  releaseDate : '' ,
  thumbnail: null as Cover  | null,
  video: [],
  tags: [] as string[],
  covers: [] as Cover[],
  is_featured: false,
  inventory: {
  backorderOptions: 'deny',
  trackInventory: false,
  lowStockThreshold: null,
  stockStatus: 'in_stock',
  weight: null,
  weightUnit: 'kg',
  dimensions: {
    length: null,
    width: null,
    height: null,
    unit: 'cm',
    },
    warehouseLocation: '',
    fulfillmentType: 'in_house',
  },
  shipping: {
    shippingClass: 'express',
    shippingCostOverride: null,
    isReturnable: true,
    returnWindow: 14,
    returnPolicy: 'free_return',
  },
  meta: null,
  vendor: null,
  variants : [] , 
  product_attributes : [] ,
  related_products : [] ,
  faqs : [] ,
  badge: null ,
  show_countdown : true ,
  show_related_products : true ,
  show_reviews : true ,
  show_social_share : true ,
  allow_backorder : false ,
  promotion_ids : [] , 
   coupon_ids : []
  };
 
  return baseProductData ; 
}


export const getEditedData = (
  product: ProductSchemaType,
) => {
  const baseData : ProductSchemaType = {
    id: product.id ?? undefined,
    name: product.name ?? "",
    brand: product.brand ?? "",
    sub_categories: product.sub_categories   ?? [],
    description: product.description ?? "",
    price : product.price ?? null , 
    compare_price : product.price ?? null ,
    sku : product.sku ?? null , 
    stock : product.stock ?? null , 
    madeCountry : product.madeCountry ?? '' , 
    releaseDate : product.releaseDate ,
    thumbnail: product.thumbnail ?? null,
    video: product.video ?? {id : null  , url : null , iframe : null , primary : null},
    covers: product.covers ?? [],
    tags: product.tags ?? [],
    is_visible : product.is_visible ?? true ,
    is_featured: product.is_featured ?? false,
    category_niche_id : product.category_niche_id,
    inventory: product.inventory,
    shipping: product.shipping,
    meta: product.meta,
    vendor: product.vendor,
    variants : product.variants ?? [] ,
    related_products : product.related_products ?? [] , 
    product_attributes : product.product_attributes ?? [] ,
    faqs : product.faqs ?? [] ,
    badge : product.badge ?? null ,
    show_countdown : product.show_countdown ?? true ,
    show_related_products : product.show_related_products ?? true ,
    show_reviews : product.show_reviews ?? true,
    show_social_share : product.show_social_share ?? true ,
    allow_backorder : product.allow_backorder ?? false,
    coupon_ids : product.coupon_ids ,
     promotion_ids : product.promotion_ids
  };
  return baseData ;
};
