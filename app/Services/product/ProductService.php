<?php


namespace App\Services\product;

use App\Models\Coupon;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Tag;
use App\Services\MediaService;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\In;

class ProductService {

    
   public function __construct(private MediaService $mediaService) {}
    
   
    public function saveDraft($payload ,?Product $product) {
        $product = $product ?? new Product();
        // product is created (not null anymore ) ;
        return DB::transaction(function() use ($product , $payload){
            $payload = $this->prepareProductPayload($payload);
            $payload = $this->slugProduct($payload, $product);
            $product->fill($payload) ;
            $product->save();
            // save tags
            $ids = $this->storeTags(collect($payload['tags']));
            $this ->syncTags($product , $ids); // sync tags to the product/product
            $this ->syncSubCategories($product , $payload['sub_categories'] ?? [] ) ;
            //store vedio iframe url if exists
            $this->mediaService->storeIframeVideo($product , $payload['video']);
            // resolve attributes map the values with comma separated
            $updated_product_attributes = $this->resolveProductAttributes($payload['product_attributes']);
            $payload['product_attributes'] = $updated_product_attributes;
            // store variants
            $updatedVariants = $this -> resolveVariants($payload);
            $this-> storeVariants($product ,$updatedVariants );
            $this->evaluateProductScore($product);
            // coupons and promotions related to this product
            $this->attachApplicableProducts($product, $payload['promotion_ids'] ?? [], Promotion::class);
            $this->attachApplicableProducts($product, $payload['coupon_ids'] ?? [], Coupon::class);
        
            return $product->fresh(); 
        });
    }
   
   public function storeTags(Collection $tags) : Collection
    {
        
        if ($tags->isEmpty()) {
            return collect();
        }

        $tags = $tags
            ->map(fn ($tag) => trim(strtolower($tag)))
            ->filter()
            ->unique()
            ->values();

        if ($tags->isEmpty()) {
            return collect();
        }

        Tag::upsert(
            $tags->map(fn ($tag) => [
                'name' => $tag,
                'slug' => Str::slug($tag),
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray(),
            ['name'],                 // unique key
            ['updated_at']

        );

        return Tag::whereIn('name' , $tags)->pluck('id') ;
    }
    
    private function syncSubCategories(Product $product , array $subCategories  ){
          $product->subCategories()->sync($subCategories) ;
    }

    private function syncTags(Product $product , Collection $tagsIds){
        $product->tags()->sync($tagsIds) ;
    }
     
    public function prepareProductPayload(array $payload) : array
    {
      $data = array_merge(
        [
            'faqs'                  => [],
            'related_product_ids'   => [],
            'subCategories'         => [],
            'tags'                  => [],
            'isFeatured'            => false,
            'isFreeShipping'        => false,
            'allow_backorder'       => false,
            'show_countdown'        => true,
            'show_reviews'          => true,
            'show_related_products' => true,
            'show_social_share'     => true,
            'inventory'             => null,
            'shipping'              => null,
            'meta'                  => null,
            'vendor'                => null,
        ],
        $payload
      ) ;

      return $data ;
    }
   

    public function slugProduct(array $payload, Product $product): array
    {
        if (!$product->exists) {
            $payload['slug'] = $this->generateSlug($payload['name']);
        }
        return $payload;
    }

    public function updateDraft($payload , Product $product){
       return   $this->saveDraft($payload , $product) ;
    }

    public function isPublishable(Product $product) : bool
    {
        return !empty($product->name)
        && !empty($product->description)
        && !empty($product->thumbnail)
        && !empty($product->category_niche_id)
        && $product->quality_score >= 50;
    }

    public function storeVariants(Product $product, array $variants): void
    {
        $existingSkus = collect($variants)->pluck('sku')->filter();
        $product->variants()->whereNotIn('sku', $existingSkus)->delete(); 
        
        DB::transaction(function () use ($product , $variants) {
            collect($variants)->map(function($variant) use ($product) {
                $isSkuDuplidated = ProductVariant::whereNot('product_id', $product->id)
                                   ->where('sku' , $variant['sku'])
                                   ->exists();
                                   
                $sku = $isSkuDuplidated || empty($variant['sku']) ? 
                    $sku = $this->generateSku($product , $variant['attrs'] ):
                    $variant['sku'];
                
                $created =  ProductVariant::updateOrCreate(
                           ['sku' => $sku , 'product_id' => $product->id] ,
                           [
                                'price' => Arr::get($variant,'price'),
                                'compare_price'=> Arr::get($variant,'compare_price'),
                                'stock'=> Arr::get($variant,'stock'),
                                'attrs' => Arr::get($variant, 'attrs'),
                                'is_default'    => $variant['is_default'] ?? false,
                                'is_single' => $variant['is_single'] ?? false , 
                                'created_at'    => now(),
                                'updated_at'    => now(),
               ]) ;
                
               //asing the variant to its morph media

                $imageId = Arr::get($variant, 'image.id');
                if ($imageId) {
                    Media::where('id', $imageId)->update([
                        'mediaable_type' => ProductVariant::class,
                        'mediaable_id'   => $created->id,
                    ]);
                }
             });

        });
    }

    private function resolveVariants(array $payload) : array{
        $updatedVariants = $payload['variants'] ;
        if(!empty($updatedVariants)){
            $hasDefault = collect($updatedVariants)->where('is_default', true)->count();
            abort_if($hasDefault > 1, 422, 'Only one variant can be default');
            // If none marked as default → make first one default
            if ($hasDefault === 0) {
                $updatedVariants[0]['is_default'] = true;
            }
        }
        else{
           $updatedVariants = [[
                  'price' => $payload['price'] ,
                  'compare_price' => $payload['compare_price'] ,
                  'sku' => $payload['sku'],
                  'stock' => $payload['stock'] ,
                  'attrs' => []  ,
                  'is_default' => true ,
                  'is_single' => true
           ]] ;
        }
        return $updatedVariants;
    }
    public function generateSku(Product $product, array $attrs, int $maxAttempts = 5): string
    {
        $base = strtoupper(Str::slug($product->name, '-')); // BLUE-TSHIRT
        
        $attrPart = !empty($attrs)
            ? collect($attrs)
                ->map(function($attr) {
                    // color object has hex + name
                    if (is_array($attr) && isset($attr['hex'], $attr['name'])) {
                        return strtoupper($attr['name']);
                    }
                    // plain string (size, material, etc)
                    return strtoupper($attr);
                })
                ->join('-')
            : 'DEFAULT';

        for ($i = 0; $i < $maxAttempts; $i++) {
            $sku = $base . '-' . $attrPart . '-' . strtoupper(Str::random(4));
            // BLUE-TSHIRT-RED-XL-AX7K

            if (!ProductVariant::where('sku', $sku)->exists()) {
                return $sku;
            }
        }

        throw new \RuntimeException('Failed to generate unique SKU, please try again.');
    }

    public function generateSlug(string $name): string
    {
        $slug = Str::slug($name);

        // Check if base slug is available first
        if (!Product::where('slug', $slug)->exists()) {
            return $slug;
        }

        // Keep trying until unique
        for ($i = 0; $i < 5; $i++) {
            $newSlug = $slug . '-' . strtolower(Str::random(4));
            
            if (!Product::where('slug', $newSlug)->exists()) {
                return $newSlug;
            }
        }

        throw new \RuntimeException('Failed to generate unique slug, please try again.');
    }

    public function evaluateProductScore (Product $product): int
    {

        // Optional fields - boost quality score
        $score = 0;
        if ($product->variants()->exists())      $score += 30; // most important ✅
        if ($product->thumbnail()->exists())    $score += 10; // drives sales
        if ($product->covers()->count() >= 2)    $score += 15; // drives sales
        if (strlen($product->description) > 200) $score += 20; // rich content
        if ($product->subCategories()->exists()) $score += 15; // navigation
        if ($product->tags()->exists())          $score += 10; // SEO
        $product->quality_score = $score;
        $product->save();

        return $score;
    }

    public function publish(Product $product): void
    {
        
        $product->update([
            'status' => 'published'
        ]);

        $variants =  $product->variants()->pluck('id') ;
        Media::where(function($query) use ($product, $variants) {
                $query->where(function($q) use ($product) {
                    $q->where('mediaable_id', $product->id)
                    ->where('mediaable_type', Product::class);
                });
                if ($variants->isNotEmpty()) {
                    $query->orWhere(function($q) use ($variants) {
                        $q->whereIn('mediaable_id', $variants)
                        ->where('mediaable_type', ProductVariant::class);
                    });
                }
            })
            ->each(fn($media) => $media->update(['is_temporary' => 0]));


    }

    private function attachApplicableProducts(Product $product, array $ids, string $model): void
    {
        if ($model === Promotion::class) {
            return;
        }

        $items = $model::whereIn('id', $ids)->get();
        $relatedItems = $model::whereJsonContains('applicable_product_ids', $product->id)->get();
        // Remove product from deselected
         foreach ($relatedItems as $item) {
            if (!in_array($item->id, $items->pluck('id')->toArray())) {
                $item->update([
                    'applicable_product_ids' => collect($item->applicable_product_ids)
                        ->reject(fn($id) => $id === $product->id)
                        ->toArray()
                ]);
            }
        }
        // Add product to new ones
        $items->reject(fn($item) => in_array($item->id, $relatedItems->pluck('id')->toArray()))
            ->each(fn($item) => $item->update([
                'applicable_product_ids' => collect($item->applicable_product_ids)
                                                ->push($product->id)
            ]));
    }



    public function duplicate(Product $product){
       $product->load(['variants', 'media', 'attributes', 'subCategories']);

        //  replicate product
        $newProduct         = $product->replicate();
        $newProduct->sku    = $this->generateSku($product, []);
        $newProduct->slug   = Str::slug($product->name . '-' . uniqid());
        $newProduct->status = 'draft';
        $newProduct->save();

        //  replicate variants
        foreach ($product->variants as $variant) {
            $newVariant             = $variant->replicate();
            $newVariant->product_id = $newProduct->id;
            $newVariant->sku        = $this->generateSku($newProduct, $variant->attrs);
            $newVariant->save();
        }

        // replicate replicate media
        foreach ($product->media as $media) {
            $newMedia             = $media->replicate();
            $newMedia->mediaable_id   = $newProduct->id; 
            $newMedia->save();
        }

        // replicate (categories)
        $newProduct->subCategories()->attach($product->subCategories->pluck('id'));


    }

    private function resolveProductAttributes(array $product_attributes){
        return  collect($product_attributes)->map(fn($item) => [
            $item['key'] => array_map('trim', explode(',', $item['values']))
        ]);
    }
}//class close tag
