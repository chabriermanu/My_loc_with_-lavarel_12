<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_consents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('consent_type'); // geolocation, marketing, terms
            $table->boolean('accepted');
            $table->timestamp('accepted_at')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamps();

            // Un user ne peut avoir qu'un seul consentement par type
            $table->unique(['user_id', 'consent_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_consents');
    }
};
