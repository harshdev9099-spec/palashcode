<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReplyContactRequest;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactManagementController extends Controller
{
    /**
     * Get list of contacts with pagination and filters.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contact::with('user:id,first_name,last_name,email');

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('subject', 'like', "%{$request->search}%");
            });
        }

        $contacts = $query->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $contacts,
        ], 200);
    }

    /**
     * Get a specific contact.
     *
     * @param Contact $contact
     * @return JsonResponse
     */
    public function show(Contact $contact): JsonResponse
    {
        $contact->load(['user:id,first_name,last_name,email', 'repliedBy:id,first_name,last_name,email']);
        $contact->markAsRead();

        return response()->json([
            'success' => true,
            'data' => ['contact' => $contact],
        ], 200);
    }

    /**
     * Reply to a contact.
     *
     * @param ReplyContactRequest $request
     * @param Contact $contact
     * @return JsonResponse
     */
    public function reply(ReplyContactRequest $request, Contact $contact): JsonResponse
    {
        $contact->update([
            'admin_reply' => $request->admin_reply,
            'status' => 'replied',
            'replied_at' => now(),
            'replied_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reply sent successfully.',
            'data' => ['contact' => $contact->fresh(['user', 'repliedBy'])],
        ], 200);
    }

    /**
     * Update a contact's status.
     *
     * @param Request $request
     * @param Contact $contact
     * @return JsonResponse
     */
    public function updateStatus(Request $request, Contact $contact): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,replied,archived',
        ]);

        $contact->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Contact status updated.',
            'data' => ['contact' => $contact],
        ], 200);
    }
}
