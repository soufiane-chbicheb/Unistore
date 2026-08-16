<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    
        Schema::table('invitations', function (Blueprint $table) {
            if (!Schema::hasColumn('invitations', 'email')) {
                $table->string('email')->after('id');
            }
            if (!Schema::hasColumn('invitations', 'role_id')) {
                $table->foreignId('role_id')->constrained()->onDelete('cascade')->after('email');
            }
            if (!Schema::hasColumn('invitations', 'token')) {
                $table->string('token')->unique()->after('role_id');
            }
            if (!Schema::hasColumn('invitations', 'status')) {
                $table->enum('status', ['pending', 'accepted', 'expired'])->default('pending')->after('token');
            }
            if (!Schema::hasColumn('invitations', 'expires_at')) {
                $table->timestamp('expires_at')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('claims');
        });

        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['email', 'role_id', 'token', 'status', 'expires_at']);
        });
    }
};
