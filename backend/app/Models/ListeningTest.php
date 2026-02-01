<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListeningTest extends Model
{
    protected $fillable = [
        'title',
        'description',
        'audio_path',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function parts()
    {
        return $this->hasMany(ListeningPart::class)->orderBy('part_number');
    }

    public function questions()
    {
        return $this->hasMany(ListeningQuestion::class)->orderBy('question_number');
    }

    public function attempts()
    {
        return $this->hasMany(ListeningAttempt::class);
    }

    public function getAudioUrlAttribute(): ?string
    {
        return $this->audio_path ? asset('storage/' . $this->audio_path) : null;
    }
}
