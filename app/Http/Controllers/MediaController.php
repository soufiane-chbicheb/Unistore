<?php

namespace App\Http\Controllers;

use App\Http\Requests\MediaRequest;
use App\Models\Banner;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\MediaService;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage ;
use Illuminate\Validation\Rule;

class MediaController extends Controller
{

    private array $mediables = [
         'product' => Product::class,
         'variant' => ProductVariant::class,
         'user' => User::class,
         'banner' => Banner::class
    ];

    public function __construct(private MediaService $mediaService)
    {

    }

    
    public function store(MediaRequest $request){
        logger("request" , ['request' => $request->all()]) ;
        $exists = array_key_exists(strtolower($request->model_type), $this->mediables) ;
        if(! $exists){
            return response()->json(['message' => 'this model type is not exists'],404);
        }
        $mediableInstance = $this->mediables[$request->model_type];
        $mediable = $mediableInstance::find($request->model_id) ?? null;
        $file = $request->file('file');
        $collection = $request->collection;
        $media = $this->mediaService->store($file ,$collection ,$mediable);
        return response()->json(
        [
          'media' => $media
        ]
        ,201);
       
    }

    public function destroy(Media $media){

        try{
          $media->delete();
        }catch(QueryException $e){
            return response()->json(['message'=> 'failed to delete the media retry'])->setStatusCode(404);
        }catch(Exception $e){
            return response()->json(['message'=> ''])->setStatusCode(500);
        }
        return response()->json(['message' => 'Media deleted successfully.']);
    }


    public function destroyBulk(Request $request){
        $draftId = $request->draft_id ;
        Media::where('mediaable_id' , $draftId)
                        ->where('is_temporary' , true)
                        ->each(function($media){
                            // delete file from storage
                            $filePath = str_replace('/storage/' , '' , $media->url) ;
                            Storage::disk('public')->delete($filePath) ;
                            // delete record from database
                            $media->delete() ;
                        });
        return response()->json(['message' => 'the request is here .']);
    }
}
