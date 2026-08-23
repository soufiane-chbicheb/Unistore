<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CollectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $collection = $this->route('collection');
        $storeId = session('store_id');
        
        // Handle both model binding and raw ID/slug from route
        $id = null;
        if ($collection instanceof \App\Models\RuleBasedCollection) {
            $id = $collection->id;
        } elseif (is_string($collection) || is_numeric($collection)) {
            // If it's a slug or ID string, find the ID
            $found = \App\Models\RuleBasedCollection::where('id', $collection)
                ->orWhere('slug', $collection)
                ->first();
            $id = $found ? $found->id : null;
        }

        return [
            'key'           => ['required', 'string', 'max:100', "unique:rule_based_collections,key,{$id},id,store_id,{$storeId}"],
            'name'          => ['required', 'string', 'max:255'],
            'is_active'     => ['nullable', 'boolean'],
            
            'rules'         => ['nullable', 'array'],
            'rules.*.id'    => ['nullable', 'string'],
            'rules.*.field' => ['nullable', 'string'],
            'rules.*.operator' => ['nullable', 'string'],
            'rules.*.value' => ['nullable'],

            'layout_config'               => ['nullable', 'array'],
            'layout_config.displayLimit'  => ['nullable', 'integer', 'min:1', 'max:100'],
            'layout_config.gap'           => ['nullable', 'integer', 'min:0'],
            'layout_config.paddingInline' => ['nullable', 'integer', 'min:0'],

            'card_config'              => ['nullable', 'array'],
            'card_config.aspectRatio'  => ['nullable', 'string'],
            'card_config.borderRadius' => ['nullable', 'integer', 'min:0'],
            'card_config.showPrice'    => ['nullable', 'boolean'],
            'card_config.showBadge'    => ['nullable', 'boolean'],
            'card_config.textAlign'    => ['nullable', 'string'],
            'card_config.hoverEffect'  => ['nullable', 'string'],
        ];
    }
}
