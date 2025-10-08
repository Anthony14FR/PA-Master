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
            $table->string('bank_account_holder_name')->nullable()->after('stripe_payouts_enabled');
            $table->string('bank_account_iban')->nullable()->after('bank_account_holder_name');
            $table->string('bank_account_bic')->nullable()->after('bank_account_iban');
            $table->string('bank_account_last4')->nullable()->after('bank_account_bic');
            $table->boolean('bank_account_verified')->default(false)->after('bank_account_last4');
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
                'bank_account_holder_name',
                'bank_account_iban',
                'bank_account_bic',
                'bank_account_last4',
                'bank_account_verified',
                'bank_account_verified_at',
            ]);
        });
    }
};
