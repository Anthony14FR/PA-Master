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
        Schema::create('booking_payouts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('booking_id')->unique()->constrained('bookings')->onDelete('cascade');
            $table->string('stripe_transfer_id', 50)->unique();
            $table->string('establishment_stripe_account_id', 50)->index();
            $table->decimal('amount', 10, 2);
            $table->char('currency', 3)->default('EUR');
            $table->enum('status', ['pending', 'in_transit', 'paid', 'failed', 'canceled'])->index();
            $table->timestamp('transferred_at')->nullable();
            $table->timestamp('estimated_arrival')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_payouts');
    }
};
