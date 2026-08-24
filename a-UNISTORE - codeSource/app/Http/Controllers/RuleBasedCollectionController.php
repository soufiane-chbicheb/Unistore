<?php

namespace App\Http\Controllers;

use App\Http\Requests\CollectionRequest;
use App\Models\AppFactoryConfig;
use App\Models\RuleBasedCollection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuleBasedCollectionController extends Controller
{  

    public function index($tenant)
    {
        $collections = RuleBasedCollection::leftJoin('home_layout_orcs' , function($join){
                $join->on('home_layout_orcs.sortable_id' , '=' , 'rule_based_collections.id')
                      ->where('home_layout_orcs.sortable_type'  , 'product_collection') ;
            })
            ->orderBy('home_layout_orcs.order')
            ->get(['rule_based_collections.*', 'home_layout_orcs.order']);
            
        // Updated to match the actual keys used in the seeder (home.X, etc.)
        $app_factory_config = AppFactoryConfig::where("config_key" , "LIKE", "collections.%")
                                                ->get(['id' , 'config_key', 'payload'])
                                                ->map(function($config) { 
                                                    return array_merge($config->payload , [
                                                        "id" => $config->id,
                                                        "config_key" => $config->config_key
                                                    ]); 
                                                });

        return Inertia::render('admin/pages/store/RuleBasedCollections/CollectionEditor', [
              "collections" => $collections,
              "app_factory_config" => $app_factory_config,
              "selectedCollection" => null
        ]);
    }
    public function edit($tenant, RuleBasedCollection $collection)
    {
        $collections = RuleBasedCollection::leftJoin('home_layout_orcs' , function($join){
            $join->on('home_layout_orcs.sortable_id' , '=' , 'rule_based_collections.id')
                  ->where('home_layout_orcs.sortable_type'  , 'product_collection') ;
        })
        ->orderBy('home_layout_orcs.order')
        ->get(['rule_based_collections.*', 'home_layout_orcs.order']);

        $app_factory_config = AppFactoryConfig::where("config_key" , "LIKE", "collections.%")
                                                ->get(['id' , 'config_key', 'payload'])
                                                ->map(function($config) { 
                                                    return array_merge($config->payload , [
                                                        "id" => $config->id,
                                                        "config_key" => $config->config_key
                                                    ]); 
                                                });
       
        return Inertia::render('admin/pages/store/RuleBasedCollections/CollectionEditor', [
              "collections" => $collections,
              "app_factory_config" => $app_factory_config,
              "selectedCollection" => $collection
        ]);
    }


    public function update($tenant, RuleBasedCollection $collection, CollectionRequest $request)
    {
        $collection->update($request->validated());

        // Refresh model to get latest data
        $collection->refresh();

        $collections = RuleBasedCollection::leftJoin('home_layout_orcs' , function($join){
            $join->on('home_layout_orcs.sortable_id' , '=' , 'rule_based_collections.id')
                  ->where('home_layout_orcs.sortable_type'  , 'product_collection') ;
        })
        ->orderBy('home_layout_orcs.order')
        ->get(['rule_based_collections.*', 'home_layout_orcs.order']);

        $app_factory_config = AppFactoryConfig::where("config_key" , "LIKE", "collections.%")
            ->get(['id', 'config_key', 'payload'])
            ->map(function ($config) {
                return array_merge($config->payload, [
                    "id" => $config->id,
                    "config_key" => $config->config_key
                ]);
            });

        return Inertia::render('admin/pages/store/RuleBasedCollections/CollectionEditor', [
            "collections" => $collections,
            "app_factory_config" => $app_factory_config,
            "selectedCollection" => $collection
        ]);
    }


    public function reorder($tenant, Request $request, RuleBasedCollection $collection)
    {
        // Reorder removed as per previous banner logic
        return back();
    }



}
