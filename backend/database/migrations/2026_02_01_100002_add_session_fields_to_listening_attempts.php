<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listening_attempts', function (Blueprint $table) {
            $table->timestamp('started_at')->nullable()->after('band_score');
            $table->timestamp('submitted_at')->nullable()->after('started_at');
            $table->integer('time_remaining')->nullable()->after('submitted_at');
            $table->tinyInteger('current_part')->default(1)->after('time_remaining');
            $table->json('part_audio_played')->nullable()->after('current_part');
        });
    }

    public function down(): void
    {
        Schema::table('listening_attempts', function (Blueprint $table) {
            $table->dropColumn(['started_at', 'submitted_at', 'time_remaining', 'current_part', 'part_audio_played']);
        });
    }
};
