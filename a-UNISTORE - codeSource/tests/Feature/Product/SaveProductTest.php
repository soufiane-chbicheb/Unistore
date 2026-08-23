<?php

namespace Tests\Feature\Product;

use App\Models\Coupon;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Tag;
use App\Services\MediaService;
use App\Services\product\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaveProductTest extends TestCase
{
    use RefreshDatabase;

    private ProductService $service;

    public function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\CategorySeeder::class);
        $this->service = $this->app->make(ProductService::class);
    }

    // =========================================================
    // ─── Helpers ─────────────────────────────────────────────
    // =========================================================

    private function makeProductPayload(array $overrides = []): array
    {
        return array_merge([
            'name'                  => 'Test Product',
            'description'           => str_repeat('a', 201),
            'price'                 => 99.99,
            'compare_price'         => 129.99,
            'sku'                   => 'TEST-SKU-001',
            'stock'                 => 10,
            'category_niche_id'     => \App\Models\Category::where('parent_id', null)->first()->id,
            'tags'                  => [],
            'subCategories'         => [],
            'variants'              => [],
            'product_attributes'    => [],
            'promotion_ids'         => [],
            'coupon_ids'            => [],
            'video'                 => [],
            'isFeatured'            => false,
            'isFreeShipping'        => false,
            'allow_backorder'       => false,
            'show_countdown'        => true,
            'show_reviews'          => true,
            'show_related_products' => true,
            'show_social_share'     => true,
            'faqs'                  => [],
            'related_product_ids'   => [],
            'inventory'             => null,
            'shipping'              => null,
            'meta'                  => null,
            'vendor'                => null,
        ], $overrides);
    }

    private function makeVariantData(array $overrides = []): array
    {
        return array_merge([
            'price'         => 49.99,
            'compare_price' => 59.99,
            'sku'           => 'VAR-SKU-' . uniqid(),
            'stock'         => 5,
            'attrs'         => [],
            'is_default'    => true,
            'image'         => null,
        ], $overrides);
    }

    private function makeAttributeData(string $key = 'color', string $value = 'red'): array
    {
        return ['key' => $key, 'value' => $value];
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


    // =========================================================
    // ─── storeTags ───────────────────────────────────────────
    // =========================================================

    public function test_store_tags_returns_empty_collection_when_empty(): void
    {
        $ids = $this->service->storeTags(collect([]));

        $this->assertCount(0, $ids);
        $this->assertDatabaseCount('tags', 0);
    }

    public function test_store_tags_normalizes_and_deduplicates(): void
    {
        // 'PHP', ' php ', 'Php' should all resolve to the same single tag
        $ids = $this->service->storeTags(collect(['PHP', ' php ', 'Php']));

        $this->assertCount(1, $ids);
        $this->assertDatabaseCount('tags', 1);
        $this->assertDatabaseHas('tags', ['name' => 'php']);
    }

    public function test_store_tags_upserts_without_creating_duplicates(): void
    {
        // Call twice with the same tag — DB should still have only 1 row
        $this->service->storeTags(collect(['php']));
        $this->service->storeTags(collect(['php']));

        $this->assertDatabaseCount('tags', 1);
    }

    public function test_store_tags_returns_ids_for_all_unique_tags(): void
    {
        $ids = $this->service->storeTags(collect(['php', 'laravel', 'vue']));

        $this->assertCount(3, $ids);
    }

    // =========================================================
    // ─── slugProduct ─────────────────────────────────────────
    // =========================================================

    public function test_generates_slug_from_product_name(): void
    {
        $payload = $this->makeProductPayload(['name' => 'test product']);

        // new Product() = not persisted → exists() = false → slug gets generated
        $result = $this->service->slugProduct($payload, new Product());

        $this->assertSame('test-product', $result['slug']);
    }

    public function test_generates_unique_slug_when_collision_exists(): void
    {
        Product::factory()->create(['slug' => 'test-product']);

        $payload = $this->makeProductPayload(['name' => 'test product']);
        $result  = $this->service->slugProduct($payload, new Product());

        $this->assertNotSame('test-product', $result['slug']);
        $this->assertStringStartsWith('test-product-', $result['slug']);
    }

    public function test_does_not_regenerate_slug_for_existing_product(): void
    {
        // A persisted product (exists() = true) should skip slug generation entirely
        $product = Product::factory()->create(['slug' => 'already-set-slug']);
        $payload = $this->makeProductPayload(['name' => 'completely different name']);

        $result = $this->service->slugProduct($payload, $product);

        $this->assertArrayNotHasKey('slug', $result);
    }

    public function test_throws_when_slug_cannot_be_made_unique(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Failed to generate unique slug');

        $service = \Mockery::mock(ProductService::class)->makePartial();
        $service->shouldAllowMockingProtectedMethods();
        $service->shouldReceive('generateSlug')
                ->andThrow(new \RuntimeException('Failed to generate unique slug, please try again.'));

        $payload = $this->makeProductPayload(['name' => 'test product']);
        $service->slugProduct($payload, new Product());
    }

    // =========================================================
    // ─── resolveVariants ─────────────────────────────────────
    // =========================================================

    public function test_aborts_when_multiple_default_variants_given(): void
    {
        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

        $payload = $this->makeProductPayload([
            'variants' => [
                $this->makeVariantData(['sku' => 'SKU-1', 'is_default' => true]),
                $this->makeVariantData(['sku' => 'SKU-2', 'is_default' => true]),
            ]
        ]);

        $this->service->saveDraft($payload, null);
    }

    public function test_sets_first_variant_as_default_when_none_marked(): void
    {
        $payload = $this->makeProductPayload([
            'variants' => [
                $this->makeVariantData(['sku' => 'SKU-FIRST',  'is_default' => false]),
                $this->makeVariantData(['sku' => 'SKU-SECOND', 'is_default' => false]),
            ]
        ]);

        $this->service->saveDraft($payload, null);

        $this->assertDatabaseHas('product_variants', ['sku' => 'SKU-FIRST',  'is_default' => true]);
        $this->assertDatabaseHas('product_variants', ['sku' => 'SKU-SECOND', 'is_default' => false]);
    }

    public function test_creates_single_variant_from_flat_payload_when_no_variants(): void
    {
        $payload = $this->makeProductPayload([
            'variants'      => [],            // empty → falls back to flat fields
            'price'         => 55.00,
            'compare_price' => 70.00,
            'sku'           => 'FLAT-SKU-001',
            'stock'         => 3,
        ]);

        $product = $this->service->saveDraft($payload, null);

        $this->assertCount(1, $product->variants);
        $this->assertDatabaseHas('product_variants', [
            'sku'        => 'FLAT-SKU-001',
            'is_default' => true,
            'stock'      => 3,
        ]);
    }

    // =========================================================
    // ─── storeVariants ───────────────────────────────────────
    // =========================================================

    public function test_stores_variants_for_product(): void
    {
        $payload = $this->makeProductPayload([
            'variants' => [
                $this->makeVariantData(['sku' => 'VAR-RED']),
                $this->makeVariantData(['sku' => 'VAR-BLUE', 'is_default' => false]),
            ]
        ]);

        $product = $this->service->saveDraft($payload, null);

        $this->assertCount(2, $product->variants);
        $this->assertDatabaseHas('product_variants', ['sku' => 'VAR-RED']);
        $this->assertDatabaseHas('product_variants', ['sku' => 'VAR-BLUE']);
    }

    public function test_deletes_variants_not_in_new_payload(): void
    {
        $payload = $this->makeProductPayload([
            'variants' => [
                $this->makeVariantData(['sku' => 'VAR-KEEP']),
                $this->makeVariantData(['sku' => 'VAR-REMOVE', 'is_default' => false]),
            ]
        ]);
        $product = $this->service->saveDraft($payload, null);

        // Second save with only one variant — VAR-REMOVE should be deleted
        $updatedPayload = $this->makeProductPayload([
            'variants' => [
                $this->makeVariantData(['sku' => 'VAR-KEEP']),
            ]
        ]);
        $this->service->saveDraft($updatedPayload, $product);

        $this->assertDatabaseHas('product_variants',     ['sku' => 'VAR-KEEP']);
        $this->assertDatabaseMissing('product_variants', ['sku' => 'VAR-REMOVE']);
    }

    public function test_generates_sku_when_none_provided(): void
    {
        $payload = $this->makeProductPayload([
            'name'     => 'Blue Shirt',
            'variants' => [
                $this->makeVariantData([
                    'sku'   => null,                    // no SKU → service generates one
                    'attrs' => [['value' => 'blue']],
                ]),
            ]
        ]);

        $product = $this->service->saveDraft($payload, null);

        $variant = $product->variants->first();
        $this->assertNotNull($variant->sku);
        $this->assertStringContainsString('BLUE-SHIRT', $variant->sku);
    }

    public function test_assigns_image_media_to_variant(): void
    {
        $product = Product::factory()->create();

        $media = Media::factory()->create([
            'mediaable_type' => Product::class,
            'mediaable_id'   => $product->id,
            'is_temporary'   => true,
        ]);

        $variants = [
            $this->makeVariantData([
                'sku'   => 'VAR-WITH-IMG',
                'image' => ['id' => $media->id],
            ])
        ];

        $this->service->storeVariants($product, $variants);

        $this->assertDatabaseHas('media', [
            'id'             => $media->id,
            'mediaable_type' => ProductVariant::class, // reassigned from Product → Variant
        ]);
    }

    // =========================================================
    // ─── storeProductAttributes ──────────────────────────────
    // =========================================================

    public function test_stores_product_attributes(): void
    {
        $product = Product::factory()->create();

        $this->service->storeProductAttributes($product, [
            $this->makeAttributeData('color', 'red'),
            $this->makeAttributeData('size', 'xl'),
        ]);

        $this->assertCount(2, $product->fresh()->attrs);
        $this->assertDatabaseHas('product_attributes', ['key' => 'color', 'value' => 'red']);
        $this->assertDatabaseHas('product_attributes', ['key' => 'size',  'value' => 'xl']);
    }

    public function test_detaches_old_attributes_before_sync(): void
    {
        $product = Product::factory()->create();

        $this->service->storeProductAttributes($product, [
            $this->makeAttributeData('color', 'red'),
        ]);

        // Replace with a completely different attribute
        $this->service->storeProductAttributes($product, [
            $this->makeAttributeData('size', 'xl'),
        ]);

        $fresh = $product->fresh()->attrs;
        $this->assertCount(1, $fresh);
        $this->assertSame('size', $fresh->first()->key);
    }

    public function test_deletes_orphaned_attributes(): void
    {
        $product = Product::factory()->create();

        $this->service->storeProductAttributes($product, [
            $this->makeAttributeData('color', 'red'),
        ]);

        // Replace — color/red is now attached to no product → must be deleted from table
        $this->service->storeProductAttributes($product, [
            $this->makeAttributeData('size', 'xl'),
        ]);

        $this->assertDatabaseMissing('product_attributes', ['key' => 'color', 'value' => 'red']);
    }

    // =========================================================
    // ─── evaluateProductScore ────────────────────────────────
    // =========================================================

    public function test_score_is_zero_when_product_has_nothing(): void
    {
        $product = Product::factory()->create(['description' => 'short']);

        $score = $this->service->evaluateProductScore($product);

        $this->assertSame(0, $score);
    }

    public function test_evaluates_product_score(): void
    {
        $product = Product::factory()->create([
            'description' => str_repeat('a', 201), // +20
        ]);

        $score = $this->service->evaluateProductScore($product);

        $this->assertSame(20, $score);
    }

    public function test_score_increases_with_tags_and_description(): void
    {
        $payload = $this->makeProductPayload([
            'description' => str_repeat('a', 201), // +20
            'tags'        => ['tag1', 'tag2'],      // +10
        ]);

        $product = $this->service->saveDraft($payload, null);

        $this->assertSame(60, $product->quality_score);
    }

  public function test_score_reaches_max_when_fully_populated(): void
{
    // create real subcategories first
    $parent = \App\Models\Category::create(['name' => 'fashion', 'slug' => 'fashion', 'parent_id' => null]);
    $sub1   = \App\Models\Category::create(['name' => 'men',  'slug' => 'men',  'parent_id' => $parent->id]);
    $sub2   = \App\Models\Category::create(['name' => 'women','slug' => 'women','parent_id' => $parent->id]);

    $payload = $this->makeProductPayload([
        'description'   => str_repeat('a', 201),         // +20
        'tags'          => ['tag1', 'tag2'],               // +10
        'subCategories' => [$sub1->id, $sub2->id],        // +15 — real IDs now
        'variants'      => [
            $this->makeVariantData(['sku' => 'FULL-SKU']), // +30
        ],
    ]);

    $product = $this->service->saveDraft($payload, null);

    $this->assertSame(75, $product->quality_score);
}

    // =========================================================
    // ─── isPublishable ───────────────────────────────────────
    // =========================================================

    public function test_product_is_publishable_when_conditions_met(): void
    {
    $product = Product::factory()->create([
        'name'          => 'Valid Product',
        'description'   => str_repeat('a', 201),
        'quality_score' => 50,
    ]);

    // create the thumbnail relationship
    Media::factory()->create([
        'mediaable_type' => Product::class,
        'mediaable_id'   => $product->id,
        'collection'     => 'thumbnail',
    ]);

    $this->assertTrue($this->service->isPublishable($product->fresh()));
   }

public function test_product_is_not_publishable_without_thumbnail(): void
{
    $product = Product::factory()->create([
        'name'          => 'Valid Product',
        'description'   => str_repeat('a', 201),
        'quality_score' => 80,
        // no thumbnail media created
    ]);

    $this->assertFalse($this->service->isPublishable($product));
}

    public function test_product_is_not_publishable_when_score_below_50(): void
    {
        $product = Product::factory()->create([
            'name'          => 'Valid Product',
            'description'   => str_repeat('a', 201),
            'quality_score' => 49,
        ]);

        $this->assertFalse($this->service->isPublishable($product));
    }

    public function test_product_is_not_publishable_without_name(): void
    {
        $product = Product::factory()->create([
            'name'          => '',
            'quality_score' => 80,
        ]);

        $this->assertFalse($this->service->isPublishable($product));
    }


    // =========================================================
    // ─── publish ─────────────────────────────────────────────
    // =========================================================

    public function test_publish_sets_status_to_published(): void
    {
        $product = Product::factory()->draft()->create();

        $this->service->publish($product);

        $this->assertDatabaseHas('products', [
            'id'     => $product->id,
            'status' => 'published',
        ]);
    }

  public function test_publish_marks_all_related_media_as_not_temporary(): void
{
    $product = Product::factory()->create();
    
    // create variant directly belonging to this product, not via factory
    $variant = ProductVariant::factory()->create(['product_id' => $product->id]);

    $media1 = Media::factory()->create([
        'mediaable_type' => Product::class,
        'mediaable_id'   => $product->id,
        'is_temporary'   => true,
    ]);

    $media2 = Media::factory()->create([
        'mediaable_type' => ProductVariant::class,
        'mediaable_id'   => $variant->id, 
        'is_temporary'   => true,
    ]);

    $this->service->publish($product);

    $this->assertDatabaseHas('media', ['id' => $media1->id, 'is_temporary' => 0]);
    $this->assertDatabaseHas('media', ['id' => $media2->id, 'is_temporary' => 0]);
}

    // =========================================================
    // ─── attachApplicableProducts ────────────────────────────
    // =========================================================

    public function test_attaches_promotions_to_product(): void
    {
        $product   = Product::factory()->create();
        $promotion = Promotion::factory()->create(['applicable_product_ids' => []]);

        $payload = $this->makeProductPayload(['promotion_ids' => [$promotion->id]]);
        $this->service->saveDraft($payload, $product);

        $this->assertContains($product->id, $promotion->fresh()->applicable_product_ids);
    }

    public function test_removes_product_from_deselected_promotions(): void
    {
        $product   = Product::factory()->create();
        $promotion = Promotion::factory()->create([
            'applicable_product_ids' => [$product->id], // already attached
        ]);

        // Save without the promotion → product must be removed
        $payload = $this->makeProductPayload(['promotion_ids' => []]);
        $this->service->saveDraft($payload, $product);

        $this->assertNotContains($product->id, $promotion->fresh()->applicable_product_ids);
    }

    public function test_attaches_coupons_to_product(): void
    {
        $product = Product::factory()->create();
        $coupon  = Coupon::factory()->create(['applicable_product_ids' => []]);

        $payload = $this->makeProductPayload(['coupon_ids' => [$coupon->id]]);
        $this->service->saveDraft($payload, $product);

        $this->assertContains($product->id, $coupon->fresh()->applicable_product_ids);
    }

    public function test_removes_product_from_deselected_coupons(): void
    {
        $product = Product::factory()->create();
        $coupon  = Coupon::factory()->create([
            'applicable_product_ids' => [$product->id], // already attached
        ]);

        $payload = $this->makeProductPayload(['coupon_ids' => []]);
        $this->service->saveDraft($payload, $product);

        $this->assertNotContains($product->id, $coupon->fresh()->applicable_product_ids);
    }

    // =========================================================
    // ─── saveDraft — integration ─────────────────────────────
    // =========================================================

    public function test_save_draft_creates_product_when_none_given(): void
    {
        $payload = $this->makeProductPayload(['name' => 'Brand New Product']);

        $product = $this->service->saveDraft($payload, null);

        $this->assertNotNull($product->id);
        $this->assertDatabaseHas('products', ['name' => 'Brand New Product']);
    }

    public function test_save_draft_updates_existing_product(): void
    {
        $product = Product::factory()->create(['name' => 'Old Name']);
        $payload = $this->makeProductPayload(['name' => 'Updated Name']);

        $this->service->saveDraft($payload, $product);

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Updated Name']);
        $this->assertDatabaseCount('products', 1); // no duplicate created
    }

    public function test_save_draft_calls_evaluate_score(): void
    {
        $payload = $this->makeProductPayload([
            'description' => str_repeat('a', 201), // guarantees at least +20
        ]);

        $product = $this->service->saveDraft($payload, null);

        $this->assertGreaterThan(0, $product->quality_score);
    }

  public function test_save_draft_rolls_back_on_failure(): void
{
    $this->mock(MediaService::class, function ($mock) {
        $mock->shouldReceive('storeIframeVideo')
             ->andThrow(new \Exception('Simulated storage failure'));
    });

    // re-resolve AFTER mock is registered 👇
    $service = $this->app->make(ProductService::class);

    $payload = $this->makeProductPayload(['name' => 'Rollback Product']);

    try {
        $service->saveDraft($payload, null);
    } catch (\Exception) {}

    $this->assertDatabaseMissing('products', ['name' => 'Rollback Product']);
}

   public function test_stores_iframe_video(): void
    {
        $payload = $this->makeProductPayload([
            'video' => [
                ['media_type' => 'iframe', 'url' => 'https://www.youtube.com/embed/abc123'],
                ['media_type' => 'iframe', 'url' => 'https://www.youtube.com/embed/xyz456'],
            ],
        ]);

        $product = $this->service->saveDraft($payload, null);

        $this->assertDatabaseHas('media', [
            'mediaable_type' => Product::class,
            'mediaable_id'   => $product->id,
            'media_type'     => 'iframe',
            'collection'     => 'gallery',
            'url'            => 'https://www.youtube.com/embed/abc123',
        ]);
    }


    public function test_variant_sku_from_another_product_is_rejected(): void
    {
        // existing variant from a different product owns 'test-sku'
        $otherProduct = Product::factory()->create();
        ProductVariant::factory()->create([
            'product_id' => $otherProduct->id,
            'sku'        => 'test-sku',
        ]);

        // new product tries to use the same SKU
        $product = $this->makeProductWithThumbnail();
        $payload = $this->makeProductPayload([
            'variants' => [
                $this->makeVariantData(['sku' => 'test-sku']),
            ]
        ]);

        $response = $this->putJson("/products/{$product->id}/submit", $payload);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['variants.0.sku']);
    }

public function test_variant_sku_can_be_reused_on_same_product(): void
{
    // same product already has a variant with this SKU — updating should be fine
    $product = $this->makeProductWithThumbnail();
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'sku'        => 'my-sku',
    ]);

    $payload = $this->makeProductPayload([
        'variants' => [
            $this->makeVariantData(['sku' => 'my-sku']), // same product, same SKU = update
        ]
    ]);

    $response = $this->putJson("/products/{$product->id}/submit", $payload);

    // should pass — SKU belongs to this product already
    $response->assertRedirect(route('drafts.index'));
}

public function test_variant_sku_unique_per_product_not_globally(): void
{
    // two different products can have the same SKU — only unique within a product
    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    ProductVariant::factory()->create([
        'product_id' => $product1->id,
        'sku'        => 'shared-sku',
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product2->id,
        'sku'        => 'shared-sku', // same SKU different product = allowed
    ]);

    $this->assertDatabaseCount('product_variants', 2);
}
}