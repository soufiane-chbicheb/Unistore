// schemas/productSchema.ts

import { z } from "zod";

// ── Variant Schema ─────────────────────────────────────────────────────────

const colorSchema = z.object({
  hex:  z.string().min(1, "Color hex is required"),
  name: z.string().min(1, "Color name is required"),
});

export const variantSchema = z.object({
  variant_id:    z.union([z.string(), z.number()]).nullable().optional(), // backend may send number
  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .min(0, "Price must be positive"),
  compare_price: z
    .number({ invalid_type_error: "Compare price must be a number" })
    .min(0, "Compare price must be positive")
    .nullable()
    .optional(),
  stock: z
    .number({ required_error: "Stock is required", invalid_type_error: "Stock must be a number" })
    .min(0, "Stock must be 0 or more"),
  sku:    z.string().nullable().optional(),                               // optional on variants
  images:  z.array(z.object({
    url: z.string().optional(),
    id:  z.number().nullable().optional(),
  })).nullable().optional(),
  isOpen: z.boolean().nullable().optional(),
  attrs:  z.record(z.string(), z.union([z.string(), colorSchema])).nullable().optional(),
});

// ── Sub-schemas ────────────────────────────────────────────────────────────

const categorySchema = z.object({
id: z.union([
    z.string().min(1, "Category ID is required"),
    z.number({ required_error: "Category ID is required" })
]) ,
  name: z.string().min(1, "Category name is required"),
});

const coverSchema = z
  .any()
  .refine((val) => val !== null && val !== undefined, { message: "Cover is required" })
  .refine((val) => typeof val?.url === "string" && val.url.length > 0, { message: "Cover URL is required" });

const videoSchema = z.object({
  media_type: z.enum(['iframe', 'video']),
  id:         z.union([z.string(), z.number()]).nullable().optional(), 
  url:        z.string().nullable().optional(),
});

// ── Nested schemas ─────────────────────────────────────────────────────────

const inventorySchema = z.object({
  backorderOptions:  z.enum(['deny', 'notify', 'allow']).nullable().optional(),
  trackInventory:    z.coerce.boolean().nullable().optional(),
  lowStockThreshold: z.number({ invalid_type_error: "Low stock threshold must be a number" }).min(0).nullable().optional(),
  stockStatus:       z.enum(['in_stock', 'out_of_stock', 'discontinued']).nullable().optional(),
  weight:            z.number({ invalid_type_error: "Weight must be a number" }).min(0).nullable().optional(),
  weightUnit:        z.enum(['kg', 'g', 'lb', 'oz']).nullable().optional(),
  dimensions: z.object({
    length: z.number({ invalid_type_error: "Length must be a number" }).min(0).nullable().optional(),
    width:  z.number({ invalid_type_error: "Width must be a number"  }).min(0).nullable().optional(),
    height: z.number({ invalid_type_error: "Height must be a number" }).min(0).nullable().optional(),
    unit:   z.enum(['cm', 'in', 'mm']).nullable().optional(),
  }).nullable().optional(),
  warehouseLocation: z.string().nullable().optional(),
  fulfillmentType:   z.enum(['in_house', 'dropship', 'third_party']).nullable().optional(),
}).nullable().optional();                                     // 👈 nullable — backend sends null

const shippingSchema = z.object({
  shippingClass:        z.enum(['standard', 'express', 'pickup']).nullable().optional(),
  shippingCostOverride: z.number({ invalid_type_error: "Shipping cost must be a number" }).min(0).nullable().optional(),
  isReturnable:         z.coerce.boolean().nullable().optional(),
  returnWindow:         z.number({ invalid_type_error: "Return window must be a number" }).min(0).nullable().optional(),
  returnPolicy:         z.enum(['free_return', 'paid_return', 'no_return']).nullable().optional(),
}).nullable().optional();                                     // 👈 nullable

const metaSchema = z.object({
  metaTitle:       z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
}).nullable().optional();                                     // 👈 nullable

const vendorSchema = z.object({
  vendorName:  z.string().nullable().optional(),
  vendorSku:   z.string().nullable().optional(),
  vendorNotes: z.string().nullable().optional(),
}).nullable().optional();                                     // 👈 nullable

const attributesSchema = z.object({
  key:   z.string(),
  value: z.string(),
});

// ── Main Product Schema ────────────────────────────────────────────────────

export const productSchema = z.object({
  id: z.union([z.string(), z.number()]).nullable().optional(), // 👈 backend sends number

  category_niche_id: z.number({ required_error: "Category niche is required" }),
  name:              z.string().min(1, "Product name is required"),

  // optional base fields

  brand:       z.string().nullable().optional(),
  releaseDate: z.union([z.string(), z.number()]).nullable().optional(),
  madeCountry: z.string().nullable().optional(),
  badge:  z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  rating_average: z.number({ invalid_type_error: "Rating must be a number" }).min(0).max(5).nullable().optional(),

  // flat product fields (used when no variants)
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock must be 0 or more")
    .nullable()
    .optional(),
  sku: z.string().nullable().optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be positive")
    .nullable()
    .optional(),
  compare_price: z
    .number({ invalid_type_error: "Compare price must be a number" })
    .min(0, "Compare price must be positive")
    .nullable()
    .optional(),

  // relations
  sub_categories:  z.array(categorySchema).nullable().optional(),
  tags:            z.array(z.string().min(1)).nullable().optional(),

  // media
thumbnail: z.any()
    .refine(
        (val) => val !== null && val !== undefined && typeof val?.id === 'number' && typeof val?.url === 'string' && val.url.length > 0,
        { message: "Thumbnail is required" }
    ),

  video:     z.array(videoSchema).nullable().default([]),
  covers:    z.array(coverSchema).nullable().optional(),

  // booleans — coerce handles 0/1 from DB  👈
  is_featured:           z.coerce.boolean().default(false),
  is_visible:       z.coerce.boolean().default(true),
  allow_backorder:      z.coerce.boolean().default(false),
  show_countdown:       z.coerce.boolean().default(true),
  show_reviews:         z.coerce.boolean().default(true),
  show_related_products:z.coerce.boolean().default(true),
  show_social_share:    z.coerce.boolean().default(true),

  // nested
  inventory: inventorySchema,
  shipping:  shippingSchema,
  meta:      metaSchema,
  vendor:    vendorSchema,

  faqs: z.array(z.object({
    question: z.string().min(1, "FAQ question is required"),
    answer:   z.string().min(1, "FAQ answer is required"),
  })).nullable().default([]),

  variants:           z.array(variantSchema).default([]),
  product_attributes: z.array(attributesSchema).default([]),
  related_products:   z.array(z.number()).default([]),

  // marketing
  promotion_ids: z.array(z.number()).default([]),
  coupon_ids:    z.array(z.number()).default([]),
});

export type ProductSchemaType = Omit<z.infer<typeof productSchema> , 'category_niche_id'> & {
    category_niche_id: number | undefined
};
export type VariantSchemaType = z.infer<typeof variantSchema>;