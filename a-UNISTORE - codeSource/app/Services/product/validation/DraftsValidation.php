<?php
namespace App\Services\product\validation;

use Illuminate\Validation\Rule;

class DraftsValidation
{
    public static function rules(): array
    {
        return array_merge(
            (new self)->base_rules(),
            (new self)->inventory_rules(),
            (new self)->shipping_rules(),
            (new self)->meta_rules(),
            (new self)->vendor_rules(),
            (new self)->variant_rules(),
            (new self)->faq_rules(),
        );
    }

    // ── Base ───────────────────────────────────────────────────────────────
    private function base_rules(): array
    {
        $nameRegex = 'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/';

        return [
            'id'                => ['nullable', 'string'],
            'category_niche_id' => ['nullable', 'integer'],

            'name'              => ['nullable', 'string', 'min:1', $nameRegex],
            'brand'             => ['nullable', 'string', 'min:1', $nameRegex],
            'description'       => ['nullable', 'string', 'min:1'],
            'sku'               => ['nullable', 'string', 'min:1'],
            'price'             => ['nullable', 'numeric', 'min:0'],
            'compare_price'     => ['nullable', 'numeric', 'min:0'],
            'stock'             => ['nullable', 'integer', 'min:0'],
            'badge'        => ['nullable', 'integer' , Rule::exists('badges' , 'id')],
            'releaseDate'       => ['nullable', 'string'],
            'madeCountry'       => ['nullable', 'string'],
            'rating_average'    => ['nullable', 'numeric', 'min:0', 'max:5'],

            'is_featured'            => ['nullable', 'boolean'],
            'is_visible'            => ['boolean'],
            'allow_backorder'       => ['nullable', 'boolean'],
            'show_countdown'        => ['nullable', 'boolean'],
            'show_reviews'          => ['nullable', 'boolean'],
            'show_related_products' => ['nullable', 'boolean'],
            'show_social_share'     => ['nullable', 'boolean'],

            // thumbnail
            'thumbnail'         => ['nullable', 'array'],
            'thumbnail.id'      => ['nullable', 'integer'],
            'thumbnail.url'     => ['nullable', 'string', 'url'],

            // covers
            'covers'            => ['nullable', 'array'],
            'covers.*.id'       => ['nullable', 'integer'],
            'covers.*.url'      => ['nullable', 'string', 'url'],

            // video
            'video'             => ['nullable', 'array'],
            'video.*.id'        => ['nullable', 'integer'],
            'video.*.url'       => ['nullable', 'string', 'url'],

            // sub_categories
            'sub_categories'        => ['nullable', 'array'],
            'sub_categories.*.id'   => ['nullable', 'integer'],
            'sub_categories.*.name' => ['nullable', 'string', 'min:1'],

            // tags
            'tags'              => ['nullable', 'array'],
            'tags.*'            => ['nullable', 'string', 'min:1'],

            // marketing
            'promotion_ids'     => ['nullable', 'array'],
            'promotion_ids.*'   => ['nullable', 'integer'],
            'coupon_ids'        => ['nullable', 'array'],
            'coupon_ids.*'      => ['nullable', 'integer'],

            // related products
            'related_products'  => ['nullable', 'array'],
            'related_products.*'=> ['nullable', 'integer'],

            // product_attributes
            'product_attributes'=> ['nullable', 'array'],
            'product_attributes.*.key'    => ['nullable', 'string', 'min:1'],
            'product_attributes.*.value'  => ['nullable', 'string', 'min:1'],
        ];
    }

    // ── Inventory ──────────────────────────────────────────────────────────
    private function inventory_rules(): array
    {
        return [
            'inventory'                         => ['nullable', 'array'],
            'inventory.backorderOptions'        => ['nullable', 'string', 'in:deny,notify,allow'],
            'inventory.trackInventory'          => ['nullable', 'boolean'],
            'inventory.lowStockThreshold'       => ['nullable', 'numeric', 'min:0'],
            'inventory.stockStatus'             => ['nullable', 'string', 'in:,in_stock,out_of_stock,discontinued'],
            'inventory.weight'                  => ['nullable', 'numeric', 'min:0'],
            'inventory.weightUnit'              => ['nullable', 'string', 'in:kg,g,lb,oz'],
            'inventory.dimensions'              => ['nullable', 'array'],
            'inventory.dimensions.length'       => ['nullable', 'numeric', 'min:0'],
            'inventory.dimensions.width'        => ['nullable', 'numeric', 'min:0'],
            'inventory.dimensions.height'       => ['nullable', 'numeric', 'min:0'],
            'inventory.dimensions.unit'         => ['nullable', 'string', 'in:cm,in,mm'],
            'inventory.warehouseLocation'       => ['nullable', 'string'],
            'inventory.fulfillmentType'         => ['nullable', 'string', 'in:,dropship,third_party'],
        ];
    }

    // ── Shipping ───────────────────────────────────────────────────────────
    private function shipping_rules(): array
    {
        return [
            'shipping'                          => ['nullable', 'array'],
            'shipping.shippingClass'            => ['nullable', 'string', 'in:,express,pickup'],
            'shipping.handlingTime'             => ['nullable', 'numeric', 'min:0'],
            'shipping.shippingCostOverride'     => ['nullable', 'numeric', 'min:0'],
            'shipping.isReturnable'             => ['nullable', 'boolean'],
            'shipping.returnWindow'             => ['nullable', 'numeric', 'min:0'],
            'shipping.returnPolicy'             => ['nullable', 'string', 'in:free_return,customer_pays'],
        ];
    }

    // ── Meta ───────────────────────────────────────────────────────────────
    private function meta_rules(): array
    {
        return [
            'meta'                      => ['nullable', 'array'],
            'meta.metaTitle'            => ['nullable', 'string', 'max:255'],
            'meta.metaDescription'      => ['nullable', 'string', 'max:1000'],
        ];
    }

    // ── Vendor ─────────────────────────────────────────────────────────────
    private function vendor_rules(): array
    {
        return [
            'vendor'                    => ['nullable', 'array'],
            'vendor.vendorName'         => ['nullable', 'string', 'max:255'],
            'vendor.vendorSku'          => ['nullable', 'string', 'max:255'],
            'vendor.vendorNotes'        => ['nullable', 'string', 'max:1000'],
        ];
    }

    // ── Variants ───────────────────────────────────────────────────────────
    private function variant_rules(): array
    {
        return [
            'variants'                          => ['nullable', 'array'],
            'variants.*.id'                     => ['nullable', 'string'],
            'variants.*.price'                  => ['nullable', 'numeric', 'min:0'],
            'variants.*.compare_price'          => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock'                  => ['nullable', 'integer', 'min:0'],
            'variants.*.sku'                    => ['nullable', 'string'],
            'variants.*.image'               => ['nullable', 'array'],
            'variants.*.image.id'               => ['nullable', 'integer' , Rule::exists('media' , 'id')],
            'variants.*.image.url'               => ['nullable', 'string' , Rule::exists('media' , 'url')], // this i sjust to optional 
            'variants.*.isOpen'                 => ['nullable', 'boolean'],
            'variants.*.attrs'                  => ['nullable', 'array'],
        ];
    }

    // ── FAQs ───────────────────────────────────────────────────────────────
    private function faq_rules(): array
    {
        return [
            'faqs'              => ['nullable', 'array'],
            'faqs.*.question'   => ['nullable', 'string', 'min:1'],
            'faqs.*.answer'     => ['nullable', 'string', 'min:1'],
        ];
    }
}