<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ListeningTest;
use App\Models\ListeningPart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ListeningTestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ListeningTest::withCount(['parts', 'questions', 'attempts']);

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $tests = $query->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $tests,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parts' => 'required|string',
        ]);

        $parts = json_decode($request->parts, true);

        if (!is_array($parts) || count($parts) !== 4) {
            return response()->json([
                'success' => false,
                'message' => 'Exactly 4 parts are required.',
            ], 422);
        }

        $validTypes = ['mcq', 'fill_blank', 'sentence_completion', 'matching', 'table_completion', 'map_labeling'];
        $textBasedTypes = ['fill_blank', 'sentence_completion', 'table_completion'];

        foreach ($parts as $pi => $part) {
            $partNum = $pi + 1;
            if (empty($part['title']) || empty($part['instructions'])) {
                return response()->json([
                    'success' => false,
                    'message' => "Part {$partNum}: Title and instructions are required.",
                ], 422);
            }

            if (!$request->hasFile("audio_part_{$partNum}")) {
                return response()->json([
                    'success' => false,
                    'message' => "Part {$partNum}: Audio file is required.",
                ], 422);
            }

            $questions = $part['questions'] ?? [];
            if (!is_array($questions) || count($questions) < 1) {
                return response()->json([
                    'success' => false,
                    'message' => "Part {$partNum}: At least one question is required.",
                ], 422);
            }

            foreach ($questions as $qi => $q) {
                $type = $q['question_type'] ?? 'mcq';
                if (!in_array($type, $validTypes)) {
                    return response()->json([
                        'success' => false,
                        'message' => "Part {$partNum}, Question " . ($qi + 1) . " has an invalid type.",
                    ], 422);
                }
                if (empty($q['question_text']) || empty($q['correct_answer'])) {
                    return response()->json([
                        'success' => false,
                        'message' => "Part {$partNum}, Question " . ($qi + 1) . " is incomplete.",
                    ], 422);
                }
                if (in_array($type, ['mcq', 'matching'])) {
                    if (empty($q['option_a']) || empty($q['option_b']) || empty($q['option_c'])) {
                        return response()->json([
                            'success' => false,
                            'message' => "Part {$partNum}, Question " . ($qi + 1) . " requires at least options A, B, and C.",
                        ], 422);
                    }
                }
            }
        }

        $audioPaths = [];
        $imagePaths = [];
        for ($i = 1; $i <= 4; $i++) {
            $audioPaths[$i] = $request->file("audio_part_{$i}")->store('listening-tests', 'public');
            if ($request->hasFile("image_part_{$i}")) {
                $imagePaths[$i] = $request->file("image_part_{$i}")->store('listening-tests/images', 'public');
            }
        }

        $test = DB::transaction(function () use ($request, $parts, $audioPaths, $imagePaths, $textBasedTypes) {
            $test = ListeningTest::create([
                'title' => $request->title,
                'description' => $request->description,
                'is_active' => $request->boolean('is_active', true),
            ]);

            $globalQuestionNumber = 0;

            foreach ($parts as $pi => $partData) {
                $partNum = $pi + 1;
                $part = $test->parts()->create([
                    'part_number' => $partNum,
                    'title' => $partData['title'],
                    'instructions' => $partData['instructions'],
                    'audio_path' => $audioPaths[$partNum],
                    'image_path' => $imagePaths[$partNum] ?? null,
                ]);

                foreach ($partData['questions'] as $qi => $q) {
                    $globalQuestionNumber++;
                    $type = $q['question_type'] ?? 'mcq';
                    $part->questions()->create([
                        'listening_test_id' => $test->id,
                        'question_number' => $globalQuestionNumber,
                        'question_type' => $type,
                        'question_text' => $q['question_text'],
                        'option_a' => $q['option_a'] ?? null,
                        'option_b' => $q['option_b'] ?? null,
                        'option_c' => $q['option_c'] ?? null,
                        'option_d' => $q['option_d'] ?? null,
                        'word_limit' => in_array($type, $textBasedTypes) ? ($q['word_limit'] ?? 3) : null,
                        'correct_answer' => $q['correct_answer'],
                    ]);
                }
            }

            return $test;
        });

        $test->load('parts.questions');

        return response()->json([
            'success' => true,
            'message' => 'Listening test created successfully.',
            'data' => ['test' => $test],
        ], 201);
    }

    public function show(ListeningTest $listeningTest): JsonResponse
    {
        $listeningTest->load('parts.questions');
        $listeningTest->loadCount('attempts');

        $listeningTest->parts->each(function ($part) {
            $part->append(['audio_url', 'image_url']);
        });

        return response()->json([
            'success' => true,
            'data' => ['test' => $listeningTest],
        ]);
    }

    public function update(Request $request, ListeningTest $listeningTest): JsonResponse
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
            'parts' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $listeningTest) {
            $listeningTest->fill($request->only(['title', 'description', 'is_active']));
            $listeningTest->save();

            if ($request->has('parts')) {
                $parts = json_decode($request->parts, true);
                $textBasedTypes = ['fill_blank', 'sentence_completion', 'table_completion'];

                if (is_array($parts) && count($parts) === 4) {
                    // Delete old part files
                    foreach ($listeningTest->parts as $oldPart) {
                        if ($oldPart->audio_path) {
                            Storage::disk('public')->delete($oldPart->audio_path);
                        }
                        if ($oldPart->image_path) {
                            Storage::disk('public')->delete($oldPart->image_path);
                        }
                    }
                    $listeningTest->parts()->delete();

                    $globalQuestionNumber = 0;

                    foreach ($parts as $pi => $partData) {
                        $partNum = $pi + 1;

                        $audioPath = null;
                        if ($request->hasFile("audio_part_{$partNum}")) {
                            $audioPath = $request->file("audio_part_{$partNum}")->store('listening-tests', 'public');
                        } else {
                            $audioPath = $partData['existing_audio_path'] ?? '';
                        }

                        $imagePath = null;
                        if ($request->hasFile("image_part_{$partNum}")) {
                            $imagePath = $request->file("image_part_{$partNum}")->store('listening-tests/images', 'public');
                        } else {
                            $imagePath = $partData['existing_image_path'] ?? null;
                        }

                        $part = $listeningTest->parts()->create([
                            'part_number' => $partNum,
                            'title' => $partData['title'],
                            'instructions' => $partData['instructions'],
                            'audio_path' => $audioPath,
                            'image_path' => $imagePath,
                        ]);

                        foreach (($partData['questions'] ?? []) as $qi => $q) {
                            $globalQuestionNumber++;
                            $type = $q['question_type'] ?? 'mcq';
                            $part->questions()->create([
                                'listening_test_id' => $listeningTest->id,
                                'question_number' => $globalQuestionNumber,
                                'question_type' => $type,
                                'question_text' => $q['question_text'],
                                'option_a' => $q['option_a'] ?? null,
                                'option_b' => $q['option_b'] ?? null,
                                'option_c' => $q['option_c'] ?? null,
                                'option_d' => $q['option_d'] ?? null,
                                'word_limit' => in_array($type, $textBasedTypes) ? ($q['word_limit'] ?? 3) : null,
                                'correct_answer' => $q['correct_answer'],
                            ]);
                        }
                    }
                }
            }
        });

        $listeningTest->load('parts.questions');

        return response()->json([
            'success' => true,
            'message' => 'Listening test updated successfully.',
            'data' => ['test' => $listeningTest],
        ]);
    }

    public function destroy(ListeningTest $listeningTest): JsonResponse
    {
        foreach ($listeningTest->parts as $part) {
            if ($part->audio_path) Storage::disk('public')->delete($part->audio_path);
            if ($part->image_path) Storage::disk('public')->delete($part->image_path);
        }
        if ($listeningTest->audio_path) {
            Storage::disk('public')->delete($listeningTest->audio_path);
        }

        $listeningTest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Listening test deleted successfully.',
        ]);
    }

    public function results(Request $request, ListeningTest $listeningTest): JsonResponse
    {
        $attempts = $listeningTest->attempts()
            ->with('user:id,first_name,last_name,email')
            ->whereNotNull('submitted_at')
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $attempts,
        ]);
    }
}
