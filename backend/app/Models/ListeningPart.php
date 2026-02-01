<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListeningPart extends Model
{
    protected $fillable = [
        'listening_test_id',
        'part_number',
        'title',
        'instructions',
        'audio_path',
        'image_path',
    ];

    public function test()
    {
        return $this->belongsTo(ListeningTest::class, 'listening_test_id');
    }

    public function questions()
    {
        return $this->hasMany(ListeningQuestion::class)->orderBy('question_number');
    }

    public function getAudioUrlAttribute(): string
    {
        return asset('storage/' . $this->audio_path);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }
}
