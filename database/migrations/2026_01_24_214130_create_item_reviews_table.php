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
        Schema::create('item_reviews', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            //loan_id est optionnel (on peut noter un item sans forcément avoir un prêt)
            $table->foreignId('loan_id')->constrained()->cascadeOnDelete();

            $table->integer('rating');
            $table->text('comment');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_reviews');
    }
};
