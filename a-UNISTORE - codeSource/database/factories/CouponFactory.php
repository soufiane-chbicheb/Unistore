<?php

// ─────────────────────────────────────────────────────
// database/factories/CouponFactory.php
// ─────────────────────────────────────────────────────
namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    public function definition(): array
    {
        $type  = $this->faker->randomElement(['percentage', 'fixed']);
        $value = $type === 'percentage'
            ? $this->faker->randomElement([5, 10, 15, 20, 25, 30, 50])
            : $this->faker->randomElement([10, 20, 30, 50, 100]);

        $validFrom  = $this->faker->dateTimeBetween('-1 month', 'now');
        $validUntil = $this->faker->boolean(70)
            ? $this->faker->dateTimeBetween('now', '+6 months')
            : null;

        return [
            'store_id'                    => Store::inRandomOrder()->first()->id,
            'code'                        => strtoupper($this->faker->unique()->lexify('????') . $this->faker->numberBetween(5, 75)),
            'description'                 => $this->faker->optional()->sentence(),
            'type'                        => $type,
            'value'                       => $value,
            'minimum_order_amount'        => $this->faker->optional(0.5)->randomElement([50, 100, 150, 200, 300]),
            'minimum_items'               => $this->faker->optional(0.3)->numberBetween(1, 5),
            'max_uses'                    => $this->faker->optional(0.6)->numberBetween(50, 500),
            'max_uses_per_user'           => $this->faker->randomElement([1, 1, 1, 2, 3]),
            'times_used'                  => $this->faker->numberBetween(0, 50),
            'valid_from'                  => $validFrom,
            'valid_until'                 => $validUntil,
            'is_active'                   => $this->faker->boolean(80),
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
        ];
    }

    // ── Availability states ──────────────────────────────────────────────

    // Active and not expired
    public function active(): static
    {
        return $this->state(fn() => [
            'is_active'   => true,
            'valid_from'  => now()->subDays(5),
            'valid_until' => now()->addMonths(3),
        ]);
    }

    // Expired (past valid_until)
    public function expired(): static
    {
        return $this->state(fn() => [
            'is_active'   => false,
            'valid_from'  => now()->subMonths(2),
            'valid_until' => now()->subDays(10),
        ]);
    }

    // Manually disabled (is_active = false but not expired)
    public function inactive(): static
    {
        return $this->state(fn() => [
            'is_active'   => false,
            'valid_from'  => now()->subDays(5),
            'valid_until' => now()->addMonths(3),
        ]);
    }

    // Scheduled — valid_from is in the future
    public function notYetValid(): static
    {
        return $this->state(fn() => [
            'is_active'   => true,
            'valid_from'  => now()->addDays(7),
            'valid_until' => now()->addMonths(2),
        ]);
    }

    // ── Usage states ─────────────────────────────────────────────────────

    // Fully used up — times_used >= max_uses
    public function exhausted(): static
    {
        $max = $this->faker->numberBetween(10, 100);
        return $this->state(fn() => [
            'max_uses'   => $max,
            'times_used' => $max,
        ]);
    }

    // No usage limits at all
    public function unlimited(): static
    {
        return $this->state(fn() => [
            'max_uses'          => null,
            'max_uses_per_user' => 1 ,
            'times_used'        => 0,
        ]);
    }

    // Limit how many times a single user can use it
    public function requiresLogin(int $maxUsesPerUser = 1): static
    {
        return $this->state(fn() => [
            'max_uses_per_user' => $maxUsesPerUser,
        ]);
    }

    // ── Discount type states ─────────────────────────────────────────────

    // Percentage discount only
    public function percentage(): static
    {
        return $this->state(fn() => [
            'type'  => 'percentage',
            'value' => $this->faker->randomElement([10, 20, 30, 50]),
        ]);
    }

    // Fixed amount discount only
    public function fixed(): static
    {
        return $this->state(fn() => [
            'type'  => 'fixed',
            'value' => $this->faker->randomElement([10, 20, 50, 100]),
        ]);
    }

    // ── Restriction states ───────────────────────────────────────────────

    // Requires a minimum order amount
    public function withMinimumAmount(float $amount): static
    {
        return $this->state(fn() => [
            'minimum_order_amount' => $amount,
        ]);
    }

    // Requires a minimum number of items in cart
    public function withMinimumItems(int $count): static
    {
        return $this->state(fn() => [
            'minimum_items' => $count,
        ]);
    }

    // Only applies to specific products
    public function forProducts(array $productIds): static
    {
        return $this->state(fn() => [
            'applicable_product_ids' => $productIds,
        ]);
    }

    // Only applies to specific categories
    public function forCategories(array $categoryIds): static
    {
        return $this->state(fn() => [
            'applicable_category_ids' => $categoryIds,
        ]);
    }

    // Only applies to specific sub-categories
    public function forSubCategories(array $subCategoryIds): static
    {
        return $this->state(fn() => [
            'applicable_sub_category_ids' => $subCategoryIds,
        ]);
    }
}