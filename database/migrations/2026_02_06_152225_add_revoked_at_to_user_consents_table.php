<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_consents', function (Blueprint $table) {
            $table->timestamp('revoked_at')->nullable()->after('accepted_at');
            $table->string('user_agent')->nullable()->after('ip_address');
        });
    }

    public function down(): void
    {
        Schema::table('user_consents', function (Blueprint $table) {
            $table->dropColumn(['revoked_at', 'user_agent']);
        });
    }
};
