<?php

namespace App\Http\Controllers;

use App\Models\Attributes;
use App\Models\AttributesValues;
use App\Models\PAttr;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\View\View;
use Inertia\Inertia;

class AttributesController extends Controller
{
    public function index($tenant)
    {
        $commonForInitFetch = PAttr::whereIn('key', ['color', 'material' , 'size'])->pluck('id');
        $attributes = PAttr::with(['values' => function ($q) use ($commonForInitFetch) {
                $q->whereIn('attribute_id', $commonForInitFetch);
        }])->get();
        
        return Inertia::render('admin/pages/variants/AttributePage', compact('attributes'));
    }
    


    public function store($tenant, Request $request) : void
    {   // still should validate fields
        Attributes::find($request->attributeId)->values()->create(Arr::only($request->all() , (new AttributesValues)->getFillable())) ;
    }
}
