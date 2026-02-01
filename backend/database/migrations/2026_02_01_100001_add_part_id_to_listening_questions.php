<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listening_questions', function (Blueprint $table) {
            $table->foreignId('listening_part_id')->nullable()->after('listening_test_id')->constrained('listening_parts')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('listening_questions', function (Blueprint $table) {
            $table->dropForeign(['listening_part_id']);
            $table->dropColumn('listening_part_id');
        });
    }
};
