<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            // Partage de coordonnées
            $table->boolean('contact_requested')->default(false)->after('notes');
            $table->timestamp('contact_requested_at')->nullable()->after('contact_requested');
            $table->boolean('contact_shared')->default(false)->after('contact_requested_at');
            $table->timestamp('contact_shared_at')->nullable()->after('contact_shared');

            // Choix de ce qui est partagé
            $table->boolean('share_email')->default(false)->after('contact_shared_at');
            $table->boolean('share_phone')->default(false)->after('share_email');
            $table->boolean('share_address')->default(false)->after('share_phone');
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn([
                'contact_requested',
                'contact_requested_at',
                'contact_shared',
                'contact_shared_at',
                'share_email',
                'share_phone',
                'share_address',
            ]);
        });
    }
};
