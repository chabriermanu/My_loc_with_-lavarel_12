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
            $table->enum('consent_type', [
                'terms',           // CGU/CGV acceptées
                'privacy_policy',  // Politique de confidentialité
                'contact_sharing', // Partage coordonnées pour locations
                'geolocation',     // Géolocalisation
                'marketing',       // Communications marketing (optionnel)
                'data_processing'  // Traitement des données
            ]);
            $table->boolean('accepted')->default(false);
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('revoked_at')->nullable(); // Pour tracer les révocations
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable(); // Pour traçabilité complète
            $table->timestamps();

            // Un user ne peut avoir qu'un seul consentement actif par type
            $table->unique(['user_id', 'consent_type']);

            // Index pour recherches rapides
            $table->index(['user_id', 'consent_type', 'accepted']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_consents');
    }
};
