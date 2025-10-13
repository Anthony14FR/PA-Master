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
        Schema::table('establishments', function (Blueprint $table) {
            // Store only minimal bank info - full details managed by Stripe
            $table->string('bank_account_last4', 4)->nullable()->after('stripe_payouts_enabled');
            $table->string('bank_name', 100)->nullable()->after('bank_account_last4');
            $table->boolean('bank_account_verified')->default(false)->after('bank_name');
            $table->timestamp('bank_account_verified_at')->nullable()->after('bank_account_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('establishments', function (Blueprint $table) {
            $table->dropColumn([
                'bank_account_last4',
                'bank_name',
                'bank_account_verified',
                'bank_account_verified_at',
            ]);
        });
    }
};
