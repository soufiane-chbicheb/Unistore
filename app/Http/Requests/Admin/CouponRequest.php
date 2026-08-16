<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('coupon');
        return [
            'code' => 'required|string|unique:coupons,code,' . $id,
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'minimum_items' => 'nullable|integer|min:0',
            'max_uses' => 'nullable|integer|min:0',
            'max_uses_per_user' => 'required|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'is_active' => 'required|boolean',
            'applicable_product_ids' => 'nullable|array',
            'applicable_category_ids' => 'nullable|array',
            'applicable_sub_category_ids' => 'nullable|array',
        ];
    }
}
