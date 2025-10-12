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
        Schema::create('token_blacklist', function (Blueprint $table) {
            $table->id();
            $table->string('token_hash', 64)->unique()->comment('SHA-256 hash of the blacklisted token');
            $table->timestamp('expires_at')->index()->comment('When the token expires (for cleanup)');
            $table->timestamp('created_at')->useCurrent()->comment('When the token was blacklisted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('token_blacklist');
    }
};
