<?php

namespace App\Services;

use App\Models\Media;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Storage;
use Ramsey\Collection\Collection;

class MediaService
{
    /**
     * Create a new class instance.
     */

     private $folders = [
                'thumbnail' => 'products/thumbnails',
                'gallery'     => 'products/gallery',
                'video'     => 'products/videos',
                'avatar' => 'users/avatars',
                'brand_logo' => 'brands',
                'banner'     => 'banners',
                'general'   => 'general',
        ] ;
    


     public function storeIframeVideo(Product $product , array $video){
        
        if(collect($video)->isEmpty()){
            return ;
        }
        
        $filteredIframes = collect($video)->filter(fn($v)=> $v['media_type']  === 'iframe') ;
        $filteredIframes->map(fn($v) =>  $product->media()->firstOrCreate([
            'mediaable_id'   => $product->id,
            'mediaable_type' => Product::class,
            'media_type'     => 'iframe',
            'collection'     => 'gallery',
            'url'            => $v['url'],
        ])) ;
    }

    public function store($file ,string $collection = "gallery" , mixed $mediable = null){
            $storagePath  = $this->folders[$collection] ?? 'general' ;
            $path = $file->store($storagePath , 'public');
            $url = Storage::url($path) ;
            $data = [
                'url'  => $url,
                'collection' => $collection,
                'mime_type' => $file->getClientMimeType(),
                'media_type' => 'image' ,
                'size' => $file->getSize(),
                'is_temporary' => true,
            ] ;
            $media = null ;
            if($mediable){
                $media = $mediable->media()->create($data) ;
            }
            else{
                // store images for for variant in case no varaint attached yet 
                $media = new Media($data) ;
                $media->save();
            }
         
            return $media;
    }

    public function deleteMedia($media_id){
         $media = Media::where('id'  , $media_id)
                        ->where('is_temporary' , true)
                        ->firstOrFail();
        if($media){
            // delete file from storage
            Storage::disk('public')->delete($media->url) ;
            // delete record from database
            $media->delete() ;
        }


    }
}
