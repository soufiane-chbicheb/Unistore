<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class MediaRequest extends FormRequest {
    public function authorize()
    {

        return true;
    }


    public function rules()
    {
     
       // Define your validation rules for media upload here
       return [
            'file' => [],
            'collection' => 'required|in:gallery,thumbnail,avatar,variant_cover,banner',
            'model_type' => 'required|in:banner,product,variant,user,admin,brand,category,general',
       ];
       
    }

}