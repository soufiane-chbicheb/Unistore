<?php

namespace Tests\Feature\Product;

use App\Models\Category;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublishProductRequestTest extends TestCase
{
    use RefreshDatabase;

    // =========================================================
    // ─── Helpers ─────────────────────────────────────────────
    // =========================================================
public function setUp(): void
{
    parent::setUp();
    $this->seed(\Database\Seeders\CategorySeeder::class);
    $this->withHeaders(['Accept' => 'application/json']);
    $this->actingAs(\App\Models\User::factory()->create()); 
}

    private function makeProduct(): Product
    {
        return Product::factory()->create();
    }

    private function makeProductWithThumbnail(): Product
    {
        $product = Product::factory()->create();
        Media::factory()->create([
            'mediaable_type' => Product::class,
            'mediaable_id'   => $product->id,
            'collection'     => 'thumbnail',
        ]);
        return $product;
    }

    private function validPayload(array $overrides = []): array
    {
        $category = Category::create(['name' => 'fashion', 'slug' => 'fashion', 'parent_id' => null]);

        return array_merge([
            'category_niche_id' => $category->id,
            'name'              => 'Valid Product Name',
            'description'       => 'This is a valid description',
            'price'             => 99.99,
            'compare_price'     => 129.99,
            'sku'               => 'SKU-001',
            'stock'             => 10,
            'isFeatured'        => false,
            'isFreeShipping'    => false,
            'allow_backorder'   => false,
            'show_countdown'    => true,
            'show_reviews'      => true,
            'show_related_products' => true,
            'show_social_share' => true,
            'tags'              => [],
            'sub_categories'    => [],
            'variants'          => [],
            'product_attributes'=> [],
            'promotion_ids'     => [],
            'coupon_ids'        => [],
            'video'             => [],
            'faqs'              => [],
        ], $overrides);
    }

  private function submitRequest(Product $product, array $payload): \Illuminate\Testing\TestResponse
{
    $response = $this->putJson("/products/{$product->id}/submit", $payload);
    return $response;
}

    // =========================================================
    // ─── passes validation ───────────────────────────────────
    // =========================================================

    public function test_passes_with_valid_payload(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload());

        $response->assertStatus(302);
    }



    // =========================================================
    // ─── category_niche_id ───────────────────────────────────
    // =========================================================

    public function test_category_niche_id_is_required(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'category_niche_id' => null,
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['category_niche_id']);
    }

    public function test_category_niche_id_must_exist_in_db(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'category_niche_id' => 99999,
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['category_niche_id']);
    }

    // =========================================================
    // ─── name ────────────────────────────────────────────────
    // =========================================================

    public function test_name_is_required(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload(['name' => '']));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    public function test_name_must_be_at_least_3_characters(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload(['name' => 'ab']));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    public function test_name_rejects_invalid_characters(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload(['name' => 'Product <script>']));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    // =========================================================
    // ─── thumbnail (withValidator) ───────────────────────────
    // =========================================================

    public function test_fails_when_thumbnail_not_in_media_table(): void
    {
        $product = $this->makeProduct(); // no thumbnail media created

        $response = $this->submitRequest($product, $this->validPayload());

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['thumbnail']);
    }



    // =========================================================
    // ─── video ───────────────────────────────────────────────
    // =========================================================

    public function test_video_is_optional(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload(['video' => null]));

        $response->assertJsonMissingValidationErrors(['video']);
    }

    public function test_iframe_url_is_required_when_media_type_is_iframe(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'video' => [
                ['media_type' => 'iframe', 'url' => ''], // missing url
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['video.0.url']);
    }

    public function test_passes_when_thumbnail_exists_in_media_table(): void
{
    $product = $this->makeProductWithThumbnail();

    $response = $this->submitRequest($product, $this->validPayload());

    // passes validation → controller redirects → no validation errors
    $response->assertRedirect(route('drafts.index'));
}

    public function test_iframe_passes_with_valid_url(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'video' => [
                ['media_type' => 'iframe', 'url' => 'https://youtube.com/embed/abc123'],
            ]
        ]));

        $response->assertRedirect(route('drafts.index')); // 👈 passed validation
    }

    public function test_video_media_type_must_be_valid(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'video' => [
                ['media_type' => 'invalid_type', 'url' => 'https://youtube.com/embed/abc'],
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['video.0.media_type']);
    }

    // =========================================================
    // ─── variants ────────────────────────────────────────────
    // =========================================================

    public function test_variant_price_is_required(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'variants' => [
                ['price' => null, 'stock' => 5, 'attrs' => []],
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['variants.0.price']);
    }

    public function test_variant_stock_is_required(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'variants' => [
                ['price' => 10, 'stock' => null, 'attrs' => []],
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['variants.0.stock']);
    }

    public function test_variant_price_must_be_numeric(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'variants' => [
                ['price' => 'not-a-number', 'stock' => 5, 'attrs' => []],
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['variants.0.price']);
    }

    // =========================================================
    // ─── variant attrs color (withValidator) ─────────────────
    // =========================================================

    public function test_color_hex_is_required_when_color_attr_present(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'variants' => [
                [
                    'price' => 10, 'stock' => 5,
                    'attrs' => ['color' => ['hex' => '', 'name' => 'red']],
                ]
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['variants.0.attrs.color.hex']);
    }

    public function test_color_name_is_required_when_color_attr_present(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'variants' => [
                [
                    'price' => 10, 'stock' => 5,
                    'attrs' => ['color' => ['hex' => '#ff0000', 'name' => '']],
                ]
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['variants.0.attrs.color.name']);
    }

    public function test_color_passes_with_valid_hex_and_name(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'variants' => [
                [
                    'price' => 10, 'stock' => 5,
                    'attrs' => ['color' => ['hex' => '#ff0000', 'name' => 'Red']],
                ]
            ]
        ]));

        $response->assertJsonMissingValidationErrors([
            'variants.0.attrs.color.hex',
            'variants.0.attrs.color.name',
        ]);
    }

    public function test_non_color_attr_must_be_string_not_array(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'variants' => [
                [
                    'price' => 10, 'stock' => 5,
                    'attrs' => ['size' => ['unexpected' => 'array']], // should be 'M' not array
                ]
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['variants.0.attrs.size']);
    }

    public function test_non_color_attr_passes_as_plain_string(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'variants' => [
                [
                    'price' => 10, 'stock' => 5,
                    'attrs' => ['size' => 'M'],
                ]
            ]
        ]));

        $response->assertJsonMissingValidationErrors(['variants.0.attrs.size']);
    }

    // =========================================================
    // ─── product_attributes ──────────────────────────────────
    // =========================================================

    public function test_product_attribute_key_is_required(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'product_attributes' => [
                ['key' => '', 'value' => 'cotton'],
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['product_attributes.0.key']);
    }

    public function test_product_attribute_value_is_required(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'product_attributes' => [
                ['key' => 'material', 'value' => ''],
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['product_attributes.0.value']);
    }

    // =========================================================
    // ─── faqs ────────────────────────────────────────────────
    // =========================================================

    public function test_faq_question_is_required_when_faqs_present(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'faqs' => [
                ['question' => '', 'answer' => 'Some answer here'],
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['faqs.0.question']);
    }

    public function test_faq_answer_is_required_when_faqs_present(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'faqs' => [
                ['question' => 'What is the warranty?', 'answer' => ''],
            ]
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['faqs.0.answer']);
    }

    // =========================================================
    // ─── inventory ───────────────────────────────────────────
    // =========================================================

    public function test_inventory_backorder_options_must_be_valid(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'inventory' => ['backorderOptions' => 'invalid_option'],
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['inventory.backorderOptions']);
    }

    public function test_inventory_weight_unit_must_be_valid(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'inventory' => ['weightUnit' => 'stones'], // not in kg,g,lb,oz
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['inventory.weightUnit']);
    }

    // =========================================================
    // ─── shipping ────────────────────────────────────────────
    // =========================================================

    public function test_shipping_class_must_be_valid(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'shipping' => ['shippingClass' => 'teleportation'],
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['shipping.shippingClass']);
    }

    public function test_shipping_return_policy_must_be_valid(): void
    {
        $product = $this->makeProductWithThumbnail();

        $response = $this->submitRequest($product, $this->validPayload([
            'shipping' => ['returnPolicy' => 'maybe_return'],
        ]));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['shipping.returnPolicy']);
    }
}