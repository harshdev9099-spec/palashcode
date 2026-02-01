<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link to user's email
     *
     * @param ForgotPasswordRequest $request
     * @return JsonResponse
     */
    public function sendResetLink(ForgotPasswordRequest $request): JsonResponse
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email address.',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to send password reset link. Please try again.',
        ], 500);
    }

    /**
     * Reset user password
     *
     * @param ResetPasswordRequest $request
     * @return JsonResponse
     */
    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        // Decode email from the combined token (token|base64_email)
        $combinedToken = $request->input('token');
        $parts = explode('|', $combinedToken);

        if (count($parts) !== 2) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password reset token format.',
            ], 400);
        }

        $token = $parts[0];
        $email = base64_decode($parts[1]);

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password reset token.',
            ], 400);
        }

        $status = Password::reset(
            [
                'email' => $email,
                'password' => $request->input('password'),
                'password_confirmation' => $request->input('password_confirmation'),
                'token' => $token,
            ],
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password has been reset successfully. You can now login with your new password.',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid or expired password reset token. Please request a new reset link.',
        ], 400);
    }
}
