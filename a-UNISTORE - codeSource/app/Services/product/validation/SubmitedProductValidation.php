<?php
namespace App\Services\product\validation;

use App\Models\Media;
use Illuminate\Validation\Rule;

class SubmitedProductValidation
{
    public static function rules()
    {
        return array_merge(
            (new self)->product_base_rules(),
            (new self)->product_inventory_rules(),
            (new self)->product_shipping_rules(),
            (new self)->product_meta_rules(),
            (new self)->product_vendor_rules(),
            (new self)->product_attributes_rules(),
            (new self)->product_variants_rules(),
            (new self)->product_faqs_rules(),
        );
    }

    private function product_base_rules(): array
    {
        return [
            'category_niche_id' => ['required', 'integer', 'exists:categories,id'],

            'name' => [
                'bail', 'required', 'min:3',
                'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'
            ],
            'brand' => [
                'bail', 'nullable', 'min:3',
                'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'
            ],
            'description' => [
                'bail', 'nullable', 'string', 'min:10',
            ],
            'badge'        => ['nullable', 'integer' , Rule::exists('badges' , 'id')],
            'madeCountry'   => ['nullable', 'string', 'size:2'],  
            'releaseDate'   => ['nullable', 'string'],

            // pricing — required only if no variants
            'price'         => ['bail', 'nullable', 'numeric', 'min:0'],
            'compare_price' => ['bail', 'nullable', 'numeric', 'min:0', 'gte:price'],
            'sku'           => ['nullable', 'string'],
            'stock'         => ['nullable', 'integer', 'min:0'],

            // flags
            'is_featured'            => ['boolean'],
            'is_visible'            => ['boolean'],
            'allow_backorder'       => ['boolean'],
            'show_countdown'        => ['boolean'],
            'show_reviews'          => ['boolean'],
            'show_related_products' => ['boolean'],
            'show_social_share'     => ['boolean'],

            // tags
            'tags'   => ['nullable', 'array'],
            'tags.*' => [
                'bail', 'string', 'min:2',
                'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'
            ],

            // sub categories
            'sub_categories'   => ['nullable', 'array'],
            'sub_categories.*' => ['integer', 'exists:categories,id'],

            // related products
            'related_products'   => ['nullable', 'array'],
            'related_products.*' => ['integer', 'exists:products,id'],

            // promotions & coupons
            'promotion_ids'   => ['nullable', 'array'],
            'promotion_ids.*' => ['integer', 'exists:promotions,id'],
            'coupon_ids'      => ['nullable', 'array'],
            'coupon_ids.*'    => ['integer', 'exists:coupons,id'],

            // video — only iframes sent in request
            'video'              => ['nullable', 'array'],
            'video.*.media_type' => ['required', Rule::in(['iframe', 'video'])],
            'video.*.url'        => ['nullable', 'string'],
        ];
    }

    private function product_inventory_rules(): array
    {
        return [
            'inventory'                        => ['nullable', 'array'],
            'inventory.backorderOptions'       => ['nullable', 'string', Rule::in(['deny', 'allow', 'notify'])],
            'inventory.trackInventory'         => ['nullable', 'boolean'],
            'inventory.lowStockThreshold'      => ['nullable', 'integer', 'min:0'],
            'inventory.stockStatus'            => ['nullable', 'string', Rule::in(['in_stock', 'out_of_stock', 'backorder'])],
            'inventory.weight'                 => ['nullable', 'numeric', 'min:0'],
            'inventory.weightUnit'             => ['nullable', 'string', Rule::in(['kg', 'g', 'lb', 'oz'])],
            'inventory.dimensions'             => ['nullable', 'array'],
            'inventory.dimensions.length'      => ['nullable', 'numeric', 'min:0'],
            'inventory.dimensions.width'       => ['nullable', 'numeric', 'min:0'],
            'inventory.dimensions.height'      => ['nullable', 'numeric', 'min:0'],
            'inventory.dimensions.unit'        => ['nullable', 'string', Rule::in(['cm', 'in', 'm'])],
            'inventory.warehouseLocation'      => ['nullable', 'string', 'max:100'],
            'inventory.fulfillmentType'        => ['nullable', 'string', Rule::in(['dropship', 'in_house', 'third_party'])],
        ];
    }

    private function product_shipping_rules(): array
    {
        return [
            'shipping'                       => ['nullable', 'array'],
            'shipping.shippingClass'         => ['nullable', 'string', Rule::in(['standard', 'express', 'pickup'])],
            'shipping.shippingCostOverride'  => ['nullable', 'numeric', 'min:0'],
            'shipping.isReturnable'          => ['nullable', 'boolean'],
            'shipping.returnWindow'          => ['nullable', 'integer', 'min:0'],
            'shipping.returnPolicy'          => ['nullable', 'string', Rule::in(['free_return', 'paid_return', 'no_return'])],
        ];
    }

    private function product_meta_rules(): array
    {
        return [
            'meta'                    => ['nullable', 'array'],
            'meta.metaTitle'          => ['nullable', 'string', 'max:60'],
            'meta.metaDescription'    => ['nullable', 'string', 'max:160'],
        ];
    }

    private function product_vendor_rules(): array
    {
        return [
            'vendor'              => ['nullable', 'array'],
            'vendor.vendorName'   => ['nullable', 'string', 'max:100'],
            'vendor.vendorSku'    => ['nullable', 'string', 'max:100'],
            'vendor.vendorNotes'  => ['nullable', 'string', 'max:500'],
        ];
    }

   private function product_variants_rules(): array
   {
        return [
            'variants'                       => ['nullable', 'array', 'max:100'],
            'variants.*.price'               => ['required', 'numeric', 'min:0'],
            'variants.*.compare_price'       => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock'               => ['required', 'integer', 'min:0'],
            'variants.*.sku'                 => ['nullable', 'string'],
            'variants.*.image'          => ['array'],
            'variants.*.id'          => ['integer' , Rule::exists(Media::class , 'id')],
            'variants.*.url' => ['string' , 'min:2' , 'url'] , 

            // attrs is a key-value object e.g { color: {hex, name}, size: 'M' }
            'variants.*.attrs'               => ['nullable', 'array'],


        ];
    }

    private function product_faqs_rules(): array
    {
        return [
            'faqs'                => ['nullable', 'array'],
            'faqs.*.question'     => ['required', 'string', 'min:5'],
            'faqs.*.answer'       => ['required', 'string', 'min:5'],
        ];
    }



    private function product_attributes_rules(): array
    {
        return [
            'product_attributes'          => ['nullable', 'array'],
            'product_attributes.*.key'    => ['required', 'string', 'min:1', 'max:100'],
            'product_attributes.*.value'  => ['required', 'string', 'min:1', 'max:255'],
        ];
    }

  
}