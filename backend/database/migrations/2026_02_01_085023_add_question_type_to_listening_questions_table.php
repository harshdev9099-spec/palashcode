<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listening_questions', function (Blueprint $table) {
            $table->string('question_type', 30)->default('mcq')->after('question_number');
            $table->unsignedTinyInteger('word_limit')->nullable()->after('option_d');
            $table->string('option_a')->nullable()->change();
            $table->string('option_b')->nullable()->change();
            $table->string('option_c')->nullable()->change();
            $table->string('option_d')->nullable()->change();
        });

        // Change correct_answer from enum to string to support text answers
        DB::statement("ALTER TABLE listening_questions MODIFY correct_answer VARCHAR(255) NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE listening_questions MODIFY correct_answer ENUM('a','b','c','d') NOT NULL");

        Schema::table('listening_questions', function (Blueprint $table) {
            $table->dropColumn(['question_type', 'word_limit']);
            $table->string('option_a')->nullable(false)->change();
            $table->string('option_b')->nullable(false)->change();
            $table->string('option_c')->nullable(false)->change();
            $table->string('option_d')->nullable(false)->change();
        });
    }
};
