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
        Schema::create('attribute_animal_types', function (Blueprint $table) {
            $table->foreignId('attribute_definition_id')->constrained()->onDelete('cascade');
            $table->foreignId('animal_type_id')->constrained()->onDelete('cascade');

            $table->primary(['attribute_definition_id', 'animal_type_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_animal_types');
    }
};
