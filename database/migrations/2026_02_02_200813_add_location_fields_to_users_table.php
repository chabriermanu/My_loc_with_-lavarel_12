<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Ajouter uniquement les colonnes qui n'existent pas
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 20)->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'city')) {
                $table->string('city', 100)->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'postal_code')) {
                $table->string('postal_code', 10)->nullable()->after('city');
            }
            if (!Schema::hasColumn('users', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('postal_code');
            }
            if (!Schema::hasColumn('users', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Supprimer uniquement les colonnes qui existent
            $columns = [];
            if (Schema::hasColumn('users', 'phone')) $columns[] = 'phone';
            if (Schema::hasColumn('users', 'city')) $columns[] = 'city';
            if (Schema::hasColumn('users', 'postal_code')) $columns[] = 'postal_code';
            if (Schema::hasColumn('users', 'latitude')) $columns[] = 'latitude';
            if (Schema::hasColumn('users', 'longitude')) $columns[] = 'longitude';

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
