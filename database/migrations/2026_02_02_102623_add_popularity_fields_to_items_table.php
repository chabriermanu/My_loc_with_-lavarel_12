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
        Schema::table('items', function (Blueprint $table) {
            if (!Schema::hasColumn('items', 'average_rating')) {
                $table->decimal('average_rating', 3, 2)->default(0)->after('description');
            }
            
            if (!Schema::hasColumn('items', 'views_count')) {
                $table->unsignedInteger('views_count')->default(0)->after('description');
            }
            
            if (!Schema::hasColumn('items', 'comments_count')) {
                $table->unsignedInteger('comments_count')->default(0)->after('description');
            }
            
            if (!Schema::hasColumn('items', 'likes_count')) {
                $table->unsignedInteger('likes_count')->default(0)->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('items', function (Blueprint $table) {
            // Supprimer les colonnes qui existent
            if (Schema::hasColumn('items', 'average_rating')) {
                $table->dropColumn('average_rating');
            }
            if (Schema::hasColumn('items', 'views_count')) {
                $table->dropColumn('views_count');
            }
            if (Schema::hasColumn('items', 'comments_count')) {
                $table->dropColumn('comments_count');
            }
            if (Schema::hasColumn('items', 'likes_count')) {
                $table->dropColumn('likes_count');
            }
        });
    }
};
