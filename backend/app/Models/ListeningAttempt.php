<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListeningAttempt extends Model
{
    protected $fillable = [
        'user_id',
        'listening_test_id',
        'answers',
        'correct_count',
        'band_score',
        'started_at',
        'submitted_at',
        'time_remaining',
        'current_part',
        'part_audio_played',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'band_score' => 'decimal:1',
            'started_at' => 'datetime',
            'submitted_at' => 'datetime',
            'part_audio_played' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function test()
    {
        return $this->belongsTo(ListeningTest::class, 'listening_test_id');
    }

    public static function calculateBandScore(int $correct): float
    {
        $map = [
            40 => 9.0, 39 => 9.0,
            38 => 8.5, 37 => 8.5,
            36 => 8.0, 35 => 8.0,
            34 => 7.5, 33 => 7.5, 32 => 7.5,
            31 => 7.0, 30 => 7.0,
            29 => 6.5, 28 => 6.5, 27 => 6.5, 26 => 6.5,
            25 => 6.0, 24 => 6.0, 23 => 6.0,
            22 => 5.5, 21 => 5.5, 20 => 5.5, 19 => 5.5, 18 => 5.5,
            17 => 5.0, 16 => 5.0,
            15 => 4.5, 14 => 4.5, 13 => 4.5,
            12 => 4.0, 11 => 4.0,
        ];

        return $map[$correct] ?? ($correct > 40 ? 9.0 : 3.5);
    }
}
