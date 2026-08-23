<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'type' => 'required|in:percentage,fixed,free_shipping',
            'value' => 'required_if:type,percentage,fixed|numeric|min:0',
            'minimum_order_amount' => [
                'nullable',
                'numeric',
                'min:0',
                'unique:promotions,minimum_order_amount,' 
            ],
            'minimum_items' => 'nullable|integer|min:0',
            'max_uses' => 'nullable|integer|min:0',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'is_active' => 'required|boolean',
            'max_discount_amount' => 'nullable|numeric|min:0',
        ];
    }
}
