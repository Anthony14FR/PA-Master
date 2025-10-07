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
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('animal_type_id')->constrained();
            $table->string('name', 255);
            $table->string('breed', 255)->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('sex', ['male', 'female', 'unknown'])->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->boolean('is_sterilized')->nullable();
            $table->boolean('has_microchip')->default(false);
            $table->string('microchip_number', 50)->nullable();
            $table->date('adoption_date')->nullable();
            $table->text('about')->nullable();
            $table->text('health_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
