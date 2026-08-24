<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SingleOrderRequest extends FormRequest
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

        return [
            'items' => ['array' , 'required'] ,
            'items.*.variant_id' => ['integer', Rule::exists('product_variants','id')] ,
            'items.*.quantity' => ['integer', 'min:1'] ,
            'notes' => ['nullable', 'string', 'max:500'],
            'payment_method' => ['required', Rule::in(['CARD', 'COD'])],
            'payment_method_id' => [Rule::requiredIf(fn() => request('payment_method') === 'CARD') , 'string'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'address.first_name' => ['required', 'string', 'min:2', 'max:100'],
            'address.last_name' => ['required', 'string', 'min:2', 'max:100'],
            'address.email' => ['nullable', 'email', 'max:150'],
            'address.company' => ['nullable', 'string', 'max:150'],
            'address.phone' => ['required', 'string', 'min:8', 'max:20'],
            'address.address_line1' => ['required', 'string', 'min:5', 'max:255'],
            'address.address_line2' => ['nullable', 'string', 'max:255'],
            'address.city' => ['required', 'string', 'max:100'],
            'address.state' => ['required', 'string', 'max:100'],
            'address.postal_code' => ['required', 'string', 'min:3', 'max:20'],
        ];
    }


}
