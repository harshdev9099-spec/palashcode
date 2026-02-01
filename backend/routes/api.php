<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\ContactManagementController;
use App\Http\Controllers\Admin\ListeningTestController;
use App\Http\Controllers\ListeningController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// Google OAuth routes
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

// Email verification routes
Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, 'verify'])
    ->name('verification.verify');
Route::post('/email/resend', [VerifyEmailController::class, 'resend']);

// Contact form (public)
Route::post('/contact', [ContactController::class, 'store']);

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);

    Route::get('/users', [UserManagementController::class, 'index']);
    Route::get('/users/{user}', [UserManagementController::class, 'show']);
    Route::put('/users/{user}', [UserManagementController::class, 'update']);
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy']);

    Route::get('/contacts', [ContactManagementController::class, 'index']);
    Route::get('/contacts/{contact}', [ContactManagementController::class, 'show']);
    Route::post('/contacts/{contact}/reply', [ContactManagementController::class, 'reply']);
    Route::patch('/contacts/{contact}/status', [ContactManagementController::class, 'updateStatus']);

    Route::get('/listening-tests', [ListeningTestController::class, 'index']);
    Route::post('/listening-tests', [ListeningTestController::class, 'store']);
    Route::get('/listening-tests/{listeningTest}', [ListeningTestController::class, 'show']);
    Route::post('/listening-tests/{listeningTest}', [ListeningTestController::class, 'update']);
    Route::delete('/listening-tests/{listeningTest}', [ListeningTestController::class, 'destroy']);
    Route::get('/listening-tests/{listeningTest}/results', [ListeningTestController::class, 'results']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [LoginController::class, 'user']);

    // Listening tests (user-facing)
    Route::get('/listening/tests', [ListeningController::class, 'index']);
    Route::get('/listening/tests/{listeningTest}', [ListeningController::class, 'show']);
    Route::post('/listening/tests/{listeningTest}/start', [ListeningController::class, 'start']);
    Route::post('/listening/attempts/{listeningAttempt}/progress', [ListeningController::class, 'saveProgress']);
    Route::post('/listening/attempts/{listeningAttempt}/audio-played/{partNumber}', [ListeningController::class, 'markAudioPlayed']);
    Route::post('/listening/attempts/{listeningAttempt}/submit', [ListeningController::class, 'submit']);
    Route::get('/listening/attempts', [ListeningController::class, 'attempts']);
    Route::get('/listening/attempts/{listeningAttempt}', [ListeningController::class, 'attemptDetail']);
});
