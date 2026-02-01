<?php

namespace App\Services;

use App\Models\ListeningQuestion;

class AnswerCheckerService
{
    private array $spellingVariants = [
        'color' => 'colour',
        'center' => 'centre',
        'theater' => 'theatre',
        'traveling' => 'travelling',
        'traveled' => 'travelled',
        'traveler' => 'traveller',
        'canceled' => 'cancelled',
        'organize' => 'organise',
        'recognize' => 'recognise',
        'realize' => 'realise',
        'analyze' => 'analyse',
        'favor' => 'favour',
        'neighbor' => 'neighbour',
        'honor' => 'honour',
        'humor' => 'humour',
        'labor' => 'labour',
        'defense' => 'defence',
        'offense' => 'offence',
        'license' => 'licence',
        'practice' => 'practise',
        'catalog' => 'catalogue',
        'dialog' => 'dialogue',
        'program' => 'programme',
        'check' => 'cheque',
        'tire' => 'tyre',
        'gray' => 'grey',
        'jewelry' => 'jewellery',
        'enrollment' => 'enrolment',
        'fulfill' => 'fulfil',
        'skillful' => 'skilful',
        'modeling' => 'modelling',
        'counselor' => 'counsellor',
        'aluminum' => 'aluminium',
    ];

    public function checkAnswer(ListeningQuestion $question, ?string $userAnswer): bool
    {
        if ($userAnswer === null || trim($userAnswer) === '') {
            return false;
        }

        $correctAnswer = trim($question->correct_answer);
        $userAnswer = trim($userAnswer);

        if (in_array($question->question_type, ['mcq', 'matching'])) {
            return strtolower($userAnswer) === strtolower($correctAnswer);
        }

        if ($question->question_type === 'map_labeling') {
            return strtolower($userAnswer) === strtolower($correctAnswer);
        }

        // Text-based: fill_blank, sentence_completion, table_completion
        if ($question->word_limit && $this->getWordCount($userAnswer) > $question->word_limit) {
            return false;
        }

        $normalizedUser = $this->normalize($userAnswer);
        $normalizedCorrect = $this->normalize($correctAnswer);

        if ($normalizedUser === $normalizedCorrect) {
            return true;
        }

        // Check with hyphens removed
        $userNoHyphen = str_replace('-', ' ', $normalizedUser);
        $correctNoHyphen = str_replace('-', ' ', $normalizedCorrect);
        if ($this->collapseSpaces($userNoHyphen) === $this->collapseSpaces($correctNoHyphen)) {
            return true;
        }

        // Check spelling variants
        if ($this->matchesSpellingVariant($normalizedUser, $normalizedCorrect)) {
            return true;
        }

        // Check if correct answer has multiple accepted answers separated by |
        if (str_contains($correctAnswer, '|')) {
            $acceptedAnswers = explode('|', $correctAnswer);
            foreach ($acceptedAnswers as $accepted) {
                $normalizedAccepted = $this->normalize(trim($accepted));
                if ($normalizedUser === $normalizedAccepted) {
                    return true;
                }
                if ($this->matchesSpellingVariant($normalizedUser, $normalizedAccepted)) {
                    return true;
                }
            }
        }

        return false;
    }

    private function normalize(string $text): string
    {
        $text = mb_strtolower($text);
        $text = trim($text);
        $text = $this->collapseSpaces($text);
        return $text;
    }

    private function collapseSpaces(string $text): string
    {
        return preg_replace('/\s+/', ' ', $text);
    }

    public function getWordCount(string $text): int
    {
        $text = trim($text);
        if ($text === '') return 0;
        return count(preg_split('/\s+/', $text));
    }

    private function matchesSpellingVariant(string $user, string $correct): bool
    {
        // Try replacing each variant pair in both directions
        foreach ($this->spellingVariants as $us => $uk) {
            $userWithVariant = str_replace($us, $uk, $user);
            if ($userWithVariant === $correct) return true;

            $userWithVariant = str_replace($uk, $us, $user);
            if ($userWithVariant === $correct) return true;
        }

        return false;
    }
}
