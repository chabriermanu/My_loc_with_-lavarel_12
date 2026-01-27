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
        Schema::create('likes', function (Blueprint $table) 
        {
        
             $table->id();

           // Qui a liké 
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

           // Polymorphisme : item OU comment 
           // crée likeable_id + likeable_type
            $table->morphs('likeable'); 

            $table->timestamps();

            // Un user ne peut liker qu'une fois un même objet 
            $table->unique(['user_id', 'likeable_id', 'likeable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
