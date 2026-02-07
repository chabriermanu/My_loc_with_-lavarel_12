<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\GeocodingService;
use Illuminate\Console\Command;

class GeolocateExistingUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:geolocate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ajoute les coordonnées GPS aux utilisateurs existants qui ont un code postal';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Récupérer tous les utilisateurs avec un code postal mais sans coordonnées
        $users = User::whereNotNull('postal_code')
            ->whereNull('latitude')
            ->get();

        if ($users->isEmpty()) {
            $this->info('✅ Tous les utilisateurs sont déjà géolocalisés !');
            return 0;
        }

        $this->info("🔍 Trouvé {$users->count()} utilisateur(s) à géolocaliser");
        $this->newLine();

        $successCount = 0;
        $failCount = 0;

        foreach ($users as $user) {
            $this->info("📍 Géolocalisation de : {$user->email} (CP: {$user->postal_code})");

            try {
                $communes = GeocodingService::getCommunesByPostalCode($user->postal_code);

                if ($communes && count($communes) > 0) {
                    // Prendre la commune la plus peuplée (première après tri)
                    $communeCode = $communes[0]['code'];
                    $communeName = $communes[0]['nom'];

                    $this->line("   → Commune trouvée : {$communeName}");

                    $coordinates = GeocodingService::getCoordinatesByCommuneCode($communeCode);

                    if ($coordinates) {
                        $user->update([
                            'latitude' => $coordinates['latitude'],
                            'longitude' => $coordinates['longitude'],
                            'city' => $user->city ?? $coordinates['city'],
                        ]);

                        $this->info("   ✅ Succès : {$coordinates['city']} ({$coordinates['latitude']}, {$coordinates['longitude']})");
                        $successCount++;
                    } else {
                        $this->error("   ❌ Impossible de récupérer les coordonnées");
                        $failCount++;
                    }
                } else {
                    $this->warn("   ⚠️  Code postal invalide ou introuvable");
                    $failCount++;
                }
            } catch (\Exception $e) {
                $this->error("   ❌ Erreur : " . $e->getMessage());
                $failCount++;
            }

            $this->newLine();
        }

        // Résumé
        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->info("✅ Géolocalisation terminée !");
        $this->info("   • Succès : {$successCount}");
        if ($failCount > 0) {
            $this->warn("   • Échecs : {$failCount}");
        }
        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return 0;
    }
}
