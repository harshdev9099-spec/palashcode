<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     *
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::where('role', 'user')->count(),
                'total_admins' => User::where('role', 'admin')->count(),
                'verified_users' => User::where('role', 'user')->whereNotNull('email_verified_at')->count(),
                'total_contacts' => Contact::count(),
                'new_contacts' => Contact::where('status', 'new')->count(),
                'recent_users' => User::where('role', 'user')
                    ->latest()
                    ->take(5)
                    ->select('id', 'first_name', 'last_name', 'email', 'email_verified_at', 'created_at')
                    ->get(),
                'recent_contacts' => Contact::with('user:id,first_name,last_name,email')
                    ->latest()
                    ->take(5)
                    ->get(),
            ],
        ], 200);
    }
}
