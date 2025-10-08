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
        Schema::table('bookings', function (Blueprint $table) {
            $table->decimal('platform_fee', 10, 2)->default(0)->after('total_price');
            $table->decimal('establishment_amount', 10, 2)->default(0)->after('platform_fee');
            $table->string('stripe_payment_intent_id')->unique()->nullable()->after('establishment_amount');
            $table->enum('payment_status', ['pending', 'requires_action', 'processing', 'succeeded', 'failed', 'refunded'])
                ->default('pending')
                ->after('stripe_payment_intent_id');
            $table->timestamp('paid_at')->nullable()->after('payment_status');
            $table->timestamp('refunded_at')->nullable()->after('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'platform_fee',
                'establishment_amount',
                'stripe_payment_intent_id',
                'payment_status',
                'paid_at',
                'refunded_at',
            ]);
        });
    }
};
