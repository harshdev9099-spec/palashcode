<?php

namespace App\Http\Controllers;

use App\Models\ListeningAttempt;
use App\Models\ListeningTest;
use App\Services\AnswerCheckerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListeningController extends Controller
{
    public function __construct(
        private AnswerCheckerService $answerChecker
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tests = ListeningTest::where('is_active', true)
            ->withCount('questions')
            ->with(['attempts' => function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->whereNotNull('submitted_at')
                    ->select('id', 'listening_test_id', 'band_score', 'correct_count', 'created_at')
                    ->latest();
            }])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tests,
        ]);
    }

    public function show(ListeningTest $listeningTest): JsonResponse
    {
        if (!$listeningTest->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This test is not available.',
            ], 404);
        }

        $listeningTest->load(['parts' => function ($query) {
            $query->orderBy('part_number');
        }, 'parts.questions' => function ($query) {
            $query->select('id', 'listening_test_id', 'listening_part_id', 'question_number', 'question_type', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'word_limit')
                ->orderBy('question_number');
        }]);

        $listeningTest->parts->each(function ($part) {
            $part->append(['audio_url', 'image_url']);
        });

        return response()->json([
            'success' => true,
            'data' => ['test' => $listeningTest],
        ]);
    }

    public function start(Request $request, ListeningTest $listeningTest): JsonResponse
    {
        if (!$listeningTest->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This test is not available.',
            ], 404);
        }

        $existingAttempt = ListeningAttempt::where('user_id', $request->user()->id)
            ->where('listening_test_id', $listeningTest->id)
            ->whereNull('submitted_at')
            ->first();

        if ($existingAttempt) {
            return response()->json([
                'success' => true,
                'message' => 'Resuming existing attempt.',
                'data' => ['attempt' => $existingAttempt],
            ]);
        }

        $attempt = ListeningAttempt::create([
            'user_id' => $request->user()->id,
            'listening_test_id' => $listeningTest->id,
            'answers' => [],
            'correct_count' => 0,
            'band_score' => 0,
            'started_at' => now(),
            'time_remaining' => 1800,
            'current_part' => 1,
            'part_audio_played' => ['1' => false, '2' => false, '3' => false, '4' => false],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Test started.',
            'data' => ['attempt' => $attempt],
        ]);
    }

    public function saveProgress(Request $request, ListeningAttempt $listeningAttempt): JsonResponse
    {
        if ($listeningAttempt->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        if ($listeningAttempt->submitted_at) {
            return response()->json(['success' => false, 'message' => 'Test already submitted.'], 400);
        }

        $listeningAttempt->update([
            'answers' => $request->input('answers', $listeningAttempt->answers),
            'time_remaining' => $request->input('time_remaining', $listeningAttempt->time_remaining),
            'current_part' => $request->input('current_part', $listeningAttempt->current_part),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Progress saved.',
        ]);
    }

    public function markAudioPlayed(Request $request, ListeningAttempt $listeningAttempt, int $partNumber): JsonResponse
    {
        if ($listeningAttempt->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        if ($partNumber < 1 || $partNumber > 4) {
            return response()->json(['success' => false, 'message' => 'Invalid part number.'], 400);
        }

        $audioPlayed = $listeningAttempt->part_audio_played ?? [];
        $audioPlayed[(string) $partNumber] = true;
        $listeningAttempt->update(['part_audio_played' => $audioPlayed]);

        return response()->json([
            'success' => true,
            'message' => "Audio for part {$partNumber} marked as played.",
        ]);
    }

    public function submit(Request $request, ListeningAttempt $listeningAttempt): JsonResponse
    {
        if ($listeningAttempt->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        if ($listeningAttempt->submitted_at) {
            return response()->json(['success' => false, 'message' => 'Test already submitted.'], 400);
        }

        $test = $listeningAttempt->test;
        $questions = $test->questions()->orderBy('question_number')->get();

        $userAnswers = $request->input('answers', $listeningAttempt->answers ?? []);
        $correctCount = 0;

        foreach ($questions as $question) {
            $key = (string) $question->question_number;
            $userAnswer = $userAnswers[$key] ?? null;

            if ($this->answerChecker->checkAnswer($question, $userAnswer)) {
                $correctCount++;
            }
        }

        $bandScore = ListeningAttempt::calculateBandScore($correctCount);

        $listeningAttempt->update([
            'answers' => $userAnswers,
            'correct_count' => $correctCount,
            'band_score' => $bandScore,
            'submitted_at' => now(),
            'time_remaining' => $request->input('time_remaining', 0),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Test submitted successfully.',
            'data' => [
                'attempt' => $listeningAttempt->fresh(),
                'total_questions' => $questions->count(),
                'correct_count' => $correctCount,
                'band_score' => $bandScore,
            ],
        ]);
    }

    public function attempts(Request $request): JsonResponse
    {
        $attempts = ListeningAttempt::where('user_id', $request->user()->id)
            ->whereNotNull('submitted_at')
            ->with('test:id,title')
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $attempts,
        ]);
    }

    public function attemptDetail(Request $request, ListeningAttempt $listeningAttempt): JsonResponse
    {
        if ($listeningAttempt->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $listeningAttempt->load(['test.parts.questions']);

        return response()->json([
            'success' => true,
            'data' => ['attempt' => $listeningAttempt],
        ]);
    }
}
