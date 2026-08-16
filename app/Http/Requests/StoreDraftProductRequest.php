<?php


namespace App\Http\Requests;

use App\Models\Media;
use App\Services\product\validation\DraftsValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class StoreDraftProductRequest extends FormRequest{

    public function authorize(Request $request)
    {
        return true;
    }
    public function rules(Request $request){
     return DraftsValidation::rules() ;
    }

      public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // thumbnail check
            $draft = $this->route('product');
            if ($draft) {
                $hasThumbnail = Media::where('mediaable_id', $draft->id)
                                    ->where('collection', 'thumbnail')
                                    ->exists();
                if (!$hasThumbnail) {
                    $validator->errors()->add('thumbnail', 'Thumbnail is required.');
                }
            }

            // iframe url check
            foreach ($this->input('video', []) as $index => $item) {
                if (($item['media_type'] ?? null) === 'iframe' && empty($item['url'])) {
                    $validator->errors()->add("video.$index.url", 'URL is required for iframe videos.');
                }
            }
        });

        $validator->after(function ($validator) {
            $variants = $validator->getData()['variants'] ?? [];

            foreach ($variants as $index => $variant) {
                foreach ($variant['attrs'] ?? [] as $key => $value) { 
                    if ($key === 'color') {
                        if (empty($value['hex'])) {
                            $validator->errors()->add("variants.$index.attrs.color.hex", 'Color hex is required.');
                        }
                        if (empty($value['name'])) {
                            $validator->errors()->add("variants.$index.attrs.color.name", 'Color name is required.');
                        }
                    } elseif (is_array($value)) {
                        $validator->errors()->add("variants.$index.attrs.$key", "$key must be a string value.");
                    } elseif (!is_string($value) && !is_numeric($value)) {
                        $validator->errors()->add("variants.$index.attrs.$key", "$key must be a valid string.");
                    }
                }
            }
        });
    }


}

