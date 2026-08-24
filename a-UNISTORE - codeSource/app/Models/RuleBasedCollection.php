<?php

namespace App\Models;

use Google\Service\Compute\Rule;
use Illuminate\Database\Eloquent\Model;

class RuleBasedCollection extends Model
{
   use \App\Traits\BelongsToStore;
   protected $table = 'rule_based_collections';
   protected $fillable = [
       'store_id',
       'name',
       'key',
       'slug',
       'is_active',
       'layout_config',
       'card_config',
       'rules',
   ];

   protected $casts = [
       'rules' => 'array',
       'layout_config' => 'array',
       'card_config' => 'array',
   ];


   public function moveToStart()
   {
       $count = $this->getCount();
       if($count === 1 || $this->order === 1)  return  ;
       RuleBasedCollection::where('order', '<', $this->order)->increment('order');
       $this->update(['order' => 1]);
   }

   public function moveToEnd()
   {
       $count = $this->getCount();
       if($count === 1 || $this->order === $count) return  ;
       RuleBasedCollection::where('order', '>', $this->order)->decrement('order');
       $this->update(['order' => $count]);
   }

    public function moveUp()
    {
        if ($this->order === 1 || $this->getCount() === 1) return;

        $neighbor = RuleBasedCollection::where("order", "<", $this->order)
            ->orderBy('order', 'desc') 
            ->first();

        if ($neighbor) {
            $oldOrder = $this->order;
            $this->updateQuietly(['order' => $neighbor->order]);
            $neighbor->updateQuietly(['order' => $oldOrder]);
        }
    }

    public function moveDown()
    {
        $count = $this->getCount();
        if ($this->order === $count || $count === 1) return;

        $neighbor = RuleBasedCollection::where("order", ">", $this->order)
            ->orderBy('order', 'asc')
            ->first();

        if ($neighbor) {
            $oldOrder = $this->order;
            $this->updateQuietly(['order' => $neighbor->order]);
            $neighbor->updateQuietly(['order' => $oldOrder]);
        }
    }

   private function getCount(){
       return RuleBasedCollection::count();
   }


   public function homeLayoutOrcs()
   {
      return $this->morphMany(HomeLayoutOrc::class, 'sortable');
   }

}
