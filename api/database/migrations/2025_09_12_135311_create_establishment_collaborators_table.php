<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishment_collaborators', function (Blueprint $table) {
            $table->uuid('establishment_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('establishment_id')->references('id')->on('establishments')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->primary(['establishment_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('establishment_collaborators');
    }
};
