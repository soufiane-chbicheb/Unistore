<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BannerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        if ($this->has('slots') && is_string($this->slots)) {
            $this->merge([
                'slots' => json_decode($this->slots, true),
            ]);
        }

        // Deep check: If slots are sent via FormData, nested elements might be stringified
        if ($this->has('slots') && is_array($this->slots)) {
            $slots = $this->slots;
            foreach ($slots as $idx => $slot) {
                if (isset($slot['elements']) && is_string($slot['elements'])) {
                    $slots[$idx]['elements'] = json_decode($slot['elements'], true);
                }
            }
            $this->merge(['slots' => $slots]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'direction' => 'required|string|in:ltr,rtl',
            'aspect_ratio' => 'nullable|string|max:255',
            'border_radius' => 'nullable|string|max:255',
            'bg_color' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'slots' => [
                'required',
                'array',
                function ($attribute, $value, $fail) {
                    $visibleCount = collect($value)->filter(fn($slot) => ($slot['is_visible'] ?? false) == true)->count();
                    if ($visibleCount === 0) {
                        $fail('At least one slot must be visible.');
                    }
                },
            ],
            'slots.*.slot_key' => 'required|string|in:left,middle,right',
            'slots.*.is_visible' => 'required|boolean',
            'slots.*.width' => 'required',
            'slots.*.bg_color' => 'nullable|string|max:255',
            'slots.*.elements' => 'nullable|array',
            'slots.*.elements.eyebrow' => 'nullable|array',
            'slots.*.elements.title' => 'nullable|array',
            'slots.*.elements.paragraph' => 'nullable|array',
            'slots.*.elements.button' => 'nullable|array',
            'slots.*.elements.settings' => 'nullable|array',
            'slots.*.elements.settings.vertical_position' => 'nullable|string|in:top,center,bottom',
            'slots.*.elements.settings.horizontal_position' => 'nullable|string|in:left,center,right',
            'slots.*.elements.eyebrow.visible' => 'required_with:slots.*.elements.eyebrow|boolean',
            'slots.*.elements.title.visible' => 'required_with:slots.*.elements.title|boolean',
            'slots.*.elements.paragraph.visible' => 'required_with:slots.*.elements.paragraph|boolean',
            'slots.*.elements.button.visible' => 'required_with:slots.*.elements.button|boolean',
            'slots.*.elements.eyebrow.text' => 'nullable|string',
            'slots.*.elements.title.text' => 'nullable|string',
            'slots.*.elements.paragraph.text' => 'nullable|string',
            'slots.*.elements.button.text' => 'nullable|string',
            'slots.*.elements.eyebrow.color' => 'nullable|string',
            'slots.*.elements.title.color' => 'nullable|string',
            'slots.*.elements.paragraph.color' => 'nullable|string',
            'slots.*.elements.button.text_color' => 'nullable|string',
            'slots.*.elements.button.bg_color' => 'nullable|string',
            'slots.*.elements.*.link' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    if (empty($value) || $value === '#' || $value === '/') {
                        return;
                    }

                    // Pass if it's a valid external URL
                    if (filter_var($value, FILTER_VALIDATE_URL)) {
                        return;
                    }

                    // Check if it's a valid internal GET route
                    try {
                        $path = parse_url($value, PHP_URL_PATH);
                        if (!$path) return;
                        
                        if (!str_starts_with($path, '/')) {
                            $path = '/' . $path;
                        }

                        // Try matching with current host first (to support tenant routes)
                        try {
                            $request = \Illuminate\Http\Request::create($path, 'GET', [], [], [], ['HTTP_HOST' => request()->getHost()]);
                            app('router')->getRoutes()->match($request);
                            return;
                        } catch (\Exception $e) {
                            // If it fails, try without host as fallback for central routes
                            $request = \Illuminate\Http\Request::create($path, 'GET');
                            app('router')->getRoutes()->match($request);
                        }
                    } catch (\Exception $e) {
                        $fail("The link '{$value}' does not correspond to a valid application route.");
                    }
                },
            ],
            'slots.*.main_media' => 'nullable|array',
            'slots.*.main_media.id' => 'nullable|integer|exists:media,id',
            'slots.*.secondary_media' => 'nullable|array',
            'slots.*.secondary_media.id' => 'nullable|integer|exists:media,id',
        ];

        return $rules;
    }
}
