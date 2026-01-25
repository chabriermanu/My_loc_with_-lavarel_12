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
        Schema::create('items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('picture')->nullable();
            $table->string('video')->nullable();
            $table->enum('media_type', ['image', 'video', 'both']);
            $table->decimal('value', 10, 2)->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_ratings')->default(0);
            $table->integer('views_count')->default(0);
            $table->integer('favorites_count')->default(0);
            $table->enum('condition', ['new', 'like_new', 'good', 'fair', 'poor']);
            $table->boolean('is_available')->default(true);
           
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
