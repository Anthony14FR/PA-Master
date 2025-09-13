<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 255);
            $table->string('siret', 14)->unique();
            $table->text('description')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('website')->nullable();
            $table->uuid('address_id');
            $table->string('timezone', 50)->default('Europe/Paris');
            $table->boolean('is_active')->default(true);
            $table->integer('number_places_available')->nullable();
            $table->decimal('price_places_available', 8, 2)->nullable();
            $table->unsignedBigInteger('manager_id');
            $table->timestamps();

            $table->foreign('address_id')->references('id')->on('addresses');
            $table->foreign('manager_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('establishments');
    }
};
