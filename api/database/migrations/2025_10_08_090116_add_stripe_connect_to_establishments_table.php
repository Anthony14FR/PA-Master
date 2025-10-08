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
            $table->string('stripe_account_id', 50)->unique()->nullable()->after('manager_id');
            $table->boolean('stripe_onboarding_completed')->default(false)->after('stripe_account_id');
            $table->boolean('stripe_charges_enabled')->default(false)->after('stripe_onboarding_completed');
            $table->boolean('stripe_payouts_enabled')->default(false)->after('stripe_charges_enabled');

            $table->index(['stripe_onboarding_completed', 'stripe_charges_enabled', 'stripe_payouts_enabled'], 'establishments_stripe_ready_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('establishments', function (Blueprint $table) {
            $table->dropColumn([
                'stripe_account_id',
                'stripe_onboarding_completed',
                'stripe_charges_enabled',
                'stripe_payouts_enabled',
            ]);
        });
    }
};
