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
        Schema::create('user_reviews', function (Blueprint $table) {

            $table->id();

            $table->foreignId('loan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reviewee_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreignId('reviewer_id')->references('id')->on('users')->cascadeOnDelete();
            

           
            $table->enum('type', ['as_owner', 'as_borrower']);
            $table->integer('rating');
            $table->text('comment');

            // note ponctualité
            $table->integer('punctuality_rating');
            // note communication
            $table->integer('communication_rating');
            // note respect état objet
            $table->integer('condition_respect_rating');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_reviews');
    }
};
