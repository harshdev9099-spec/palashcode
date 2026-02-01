<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle Google OAuth callback
     *
     * @return JsonResponse
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Find or create user
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                // Update google_id if it doesn't exist
                if (!$user->google_id) {
                    $user->google_id = $googleUser->getId();
                    $user->email_verified_at = now(); // Trust Google's email verification
                    $user->save();
                }
            } else {
                // Create new user
                $names = explode(' ', $googleUser->getName());
                $firstName = $names[0];
                $lastName = count($names) > 1 ? implode(' ', array_slice($names, 1)) : '';

                $user = User::create([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'email_verified_at' => now(), // Trust Google's email verification
                    'password' => null, // No password for Google OAuth users
                ]);
            }

            // Create token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Redirect to frontend with token
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/auth/google/callback?token={$token}");

        } catch (\Exception $e) {
            Log::error('Google OAuth callback failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/login?error=google_auth_failed");
        }
    }
}
