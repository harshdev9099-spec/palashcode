<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listening_parts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listening_test_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('part_number');
            $table->string('title');
            $table->text('instructions');
            $table->string('audio_path');
            $table->string('image_path')->nullable();
            $table->timestamps();

            $table->unique(['listening_test_id', 'part_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listening_parts');
    }
};
