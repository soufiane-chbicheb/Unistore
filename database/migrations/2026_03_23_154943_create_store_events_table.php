<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_events', function (Blueprint $table) {
            $table->id();
            
            // Polymorphic columns
            $table->morphs('trackable'); // creates trackable_id + trackable_type

            // Event type
            $table->string('event_type', 30); // 'view', 'click', 'purchase', etc.

            // Optional context
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id', 100)->nullable();
            $table->string('ip_address', 45)->nullable();  // supports IPv6
            $table->string('user_agent')->nullable();
            $table->json('meta')->nullable(); // extra data, e.g. { "source": "homepage" }

            $table->timestamps(); // created_at + updated_at
        });

        // Extra indexes for performance
        Schema::table('store_events', function (Blueprint $table) {
            $table->index(['event_type', 'created_at']);
            $table->index('user_id');
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_events');
    }
};