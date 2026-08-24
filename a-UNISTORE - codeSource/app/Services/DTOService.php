<?php

namespace App\Services;

use Illuminate\Support\Collection;

class DTOService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    private function matchOrderItemDto(array $item ,array $param): array {
        return [
            "product_variant_id" => $item["id"],
            "quantity" => $param["quantity"],
            "price_snapshot" => $item["price"],
            "subtotal"=> $item["price"] * $param["quantity"],
            "product_variant" =>  $item,
            "product" => $item["product"] ?? []
        ];
    }
    public function prepareItemsToMatchCheckoutItemDTO(Collection $items , Collection $params) {
          $matchedDto = [] ;
          foreach($params as $param){
                 $item = $items->get($param["variant_id"])->toArray();
                 $matchedDto[] = $this->matchOrderItemDto($item , $param);
          }
          return $matchedDto;
    }
}
