<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListeningQuestion extends Model
{
    protected $fillable = [
        'listening_test_id',
        'listening_part_id',
        'question_number',
        'question_type',
        'question_text',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'word_limit',
        'correct_answer',
    ];

    public function isTextBased(): bool
    {
        return in_array($this->question_type, ['fill_blank', 'sentence_completion', 'table_completion']);
    }

    public function isMapLabeling(): bool
    {
        return $this->question_type === 'map_labeling';
    }

    public function test()
    {
        return $this->belongsTo(ListeningTest::class, 'listening_test_id');
    }

    public function part()
    {
        return $this->belongsTo(ListeningPart::class, 'listening_part_id');
    }
}
