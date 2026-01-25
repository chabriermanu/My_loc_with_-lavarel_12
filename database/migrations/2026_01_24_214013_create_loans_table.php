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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('owner_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreignId('borrower_id')->references('id')->on('users')->cascadeOnDelete();

            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['pending', 'approved', 'in_progress', 'completed', 'cancelled', 'overdue'])->default('pending');
            $table->timestamp('returned_at')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
