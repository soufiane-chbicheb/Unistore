<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
     public function suggest(Request $request){
          $query = $request->get("q");
          if (empty($query)) {
               return response()->json([], 200); // return nothing if empty
          }


          $tags = Tag::select('id', 'name')
            ->where('name', 'like', "%{$query}%")
            ->limit(10)
            ->get();
        
        return response()->json($tags,200);
     }
}
