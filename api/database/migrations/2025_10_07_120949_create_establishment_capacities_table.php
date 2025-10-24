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
        Schema::create('establishment_capacities', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('establishment_id')->constrained()->onDelete('cascade');
            $table->foreignId('animal_type_id')->constrained();
            $table->integer('max_capacity');
            $table->decimal('price_per_night', 8, 2);
            $table->timestamps();

            $table->unique(['establishment_id', 'animal_type_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('establishment_capacities');
    }
};
