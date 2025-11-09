<?php

use App\Models\Booking;
use App\Models\BookingThread;
use App\Models\Conversation;
use App\Models\Establishment;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('test')->group(function () {

    Route::get('/establishments', function (Request $request) {
        $establishments = Establishment::with(['address', 'manager'])
            ->where('is_active', true)
            ->paginate(12);

        return response()->json($establishments);
    });

    Route::get('/establishments/{uuid}', function (Request $request, string $uuid) {
        $establishment = Establishment::with(['address', 'manager'])
            ->where('id', $uuid)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($establishment);
    });

    Route::middleware(['auth.jwt'])->group(function () {

        Route::post('/conversations', function (Request $request) {
            $validated = $request->validate([
                'establishment_id' => 'required|uuid|exists:establishments,id',
            ]);

            $conversation = Conversation::firstOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'establishment_id' => $validated['establishment_id'],
                ],
                [
                    'last_message_at' => now(),
                ]
            );

            $conversation->load(['establishment', 'establishment.address', 'messages' => function ($query) {
                $query->whereNull('booking_id')
                    ->latest()
                    ->limit(50);
            }]);

            return response()->json($conversation);
        });

        Route::get('/conversations', function (Request $request) {
            $user = $request->user();
            $userId = $user->id;

            $conversations = Conversation::query()
                ->with(['establishment:id,name,logo', 'user:id,first_name,last_name,email,avatar_url']);

            if ($user->hasRole('manager')) {
                $managerEstablishments = Establishment::where('manager_id', $userId)
                    ->orWhereHas('collaborators', function ($query) use ($userId) {
                        $query->where('user_id', $userId);
                    })
                    ->pluck('id');

                $conversations->whereIn('establishment_id', $managerEstablishments);
            } else {
                $conversations->where('user_id', $userId);
            }

            $conversations = $conversations
                ->withCount([
                    'messages as unread_count' => function ($query) use ($userId) {
                        $query->where('sender_id', '!=', $userId)
                            ->whereDoesntHave('reads', function ($q) use ($userId) {
                                $q->where('user_id', $userId);
                            });
                    },
                ])
                ->with(['messages' => function ($query) {
                    $query->whereNull('booking_id')
                        ->latest()
                        ->limit(1)
                        ->select('id', 'conversation_id', 'content', 'created_at');
                }])
                ->orderByDesc('last_message_at')
                ->get()
                ->map(function ($conversation) {
                    $conversation->last_message = $conversation->messages->first();
                    unset($conversation->messages);

                    return $conversation;
                });

            return response()->json(['data' => $conversations]);
        });

        Route::get('/conversations/{id}/messages', function (Request $request, string $id) {
            $conversation = Conversation::with('establishment')->findOrFail($id);
            $userId = $request->user()->id;

            $isOwner = $conversation->user_id === $userId;
            $isManager = $conversation->establishment->manager_id === $userId;
            $isCollaborator = $conversation->establishment->collaborators->contains('id', $userId);

            if (! $isOwner && ! $isManager && ! $isCollaborator) {
                abort(403, 'Unauthorized');
            }

            $messages = Message::where('conversation_id', $id)
                ->whereNull('booking_id')
                ->with('sender')
                ->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json($messages);
        });

        Route::post('/conversations/{id}/messages', function (Request $request, string $id) {
            $validated = $request->validate([
                'content' => 'required|string|max:5000',
            ]);

            $conversation = Conversation::with('establishment')->findOrFail($id);
            $userId = $request->user()->id;

            $isOwner = $conversation->user_id === $userId;
            $isManager = $conversation->establishment->manager_id === $userId;
            $isCollaborator = $conversation->establishment->collaborators->contains('id', $userId);

            if (! $isOwner && ! $isManager && ! $isCollaborator) {
                abort(403, 'Unauthorized');
            }

            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $userId,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => $validated['content'],
            ]);

            $conversation->update(['last_message_at' => now()]);

            $message->load('sender');

            broadcast(new \App\Events\MessageSent($message))->toOthers();

            return response()->json($message, 201);
        });

        Route::post('/conversations/{id}/read', function (Request $request, string $id) {
            $conversation = Conversation::with('establishment')->findOrFail($id);
            $userId = $request->user()->id;

            $isOwner = $conversation->user_id === $userId;
            $isManager = $conversation->establishment->manager_id === $userId;
            $isCollaborator = $conversation->establishment->collaborators->contains('id', $userId);

            if (! $isOwner && ! $isManager && ! $isCollaborator) {
                abort(403, 'Unauthorized');
            }

            $unreadMessages = Message::where('conversation_id', $id)
                ->where('sender_id', '!=', $request->user()->id)
                ->whereDoesntHave('reads', function ($query) use ($request) {
                    $query->where('user_id', $request->user()->id);
                })
                ->get();

            foreach ($unreadMessages as $message) {
                $message->reads()->create([
                    'user_id' => $request->user()->id,
                    'read_at' => now(),
                ]);
            }

            return response()->json(['message' => 'Messages marked as read', 'count' => $unreadMessages->count()]);
        });

        Route::post('/bookings', function (Request $request) {
            $validated = $request->validate([
                'establishment_id' => 'required|uuid|exists:establishments,id',
                'check_in_date' => 'required|date|after:today',
                'check_out_date' => 'required|date|after:check_in_date',
                'pet_ids' => 'required|array|min:1',
                'pet_ids.*' => 'exists:pets,id',
                'service_ids' => 'nullable|array',
                'service_ids.*' => 'exists:services,id',
                'total_price' => 'required|numeric|min:0',
            ]);

            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'establishment_id' => $validated['establishment_id'],
                'check_in_date' => $validated['check_in_date'],
                'check_out_date' => $validated['check_out_date'],
                'total_price' => $validated['total_price'],
                'status' => 'confirmed',
                'payment_status' => 'paid',
            ]);

            foreach ($validated['pet_ids'] as $petId) {
                $booking->pets()->attach($petId);
            }

            if (! empty($validated['service_ids'])) {
                foreach ($validated['service_ids'] as $serviceId) {
                    $service = \App\Models\Service::find($serviceId);
                    $booking->services()->attach($serviceId, ['price' => $service->price]);
                }
            }

            $conversation = Conversation::firstOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'establishment_id' => $validated['establishment_id'],
                ],
                ['last_message_at' => now()]
            );

            $bookingThread = BookingThread::create([
                'conversation_id' => $conversation->id,
                'booking_id' => $booking->id,
                'is_active' => true,
            ]);

            $systemMessage = Message::create([
                'conversation_id' => $conversation->id,
                'booking_id' => $booking->id,
                'sender_type' => 'system',
                'message_type' => 'booking_reference',
                'content' => json_encode([
                    'booking_id' => $booking->id,
                    'check_in' => $booking->check_in_date,
                    'check_out' => $booking->check_out_date,
                    'total_price' => $booking->total_price,
                ]),
            ]);

            $conversation->update(['last_message_at' => now()]);

            broadcast(new \App\Events\BookingCreated($booking, $systemMessage))->toOthers();

            $booking->load(['establishment', 'pets', 'services']);

            return response()->json($booking, 201);
        });

        Route::get('/bookings', function (Request $request) {
            $bookings = Booking::with(['establishment', 'establishment.address', 'pets', 'services'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($bookings);
        });

        Route::get('/bookings/{id}', function (Request $request, int $id) {
            $booking = Booking::with(['establishment', 'establishment.address', 'pets', 'services'])
                ->where('id', $id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            return response()->json($booking);
        });

        Route::get('/bookings/{id}/thread', function (Request $request, int $id) {
            $booking = Booking::with('establishment')->findOrFail($id);
            $userId = $request->user()->id;

            $isOwner = $booking->user_id === $userId;
            $isManager = $booking->establishment->manager_id === $userId;
            $isCollaborator = $booking->establishment->collaborators->contains('id', $userId);

            if (! $isOwner && ! $isManager && ! $isCollaborator) {
                abort(403, 'Unauthorized');
            }

            $bookingThread = BookingThread::where('booking_id', $id)->firstOrFail();

            $messages = Message::where('conversation_id', $bookingThread->conversation_id)
                ->where('booking_id', $id)
                ->with('sender')
                ->orderBy('created_at', 'asc')
                ->get();

            return response()->json([
                'booking' => $booking->load(['establishment', 'pets', 'services']),
                'thread' => $bookingThread,
                'messages' => $messages,
            ]);
        });

        Route::post('/bookings/{id}/thread/messages', function (Request $request, int $id) {
            $validated = $request->validate([
                'content' => 'required|string|max:5000',
            ]);

            $booking = Booking::with('establishment')->findOrFail($id);
            $userId = $request->user()->id;

            $isOwner = $booking->user_id === $userId;
            $isManager = $booking->establishment->manager_id === $userId;
            $isCollaborator = $booking->establishment->collaborators->contains('id', $userId);

            if (! $isOwner && ! $isManager && ! $isCollaborator) {
                abort(403, 'Unauthorized');
            }

            $bookingThread = BookingThread::where('booking_id', $id)->firstOrFail();

            $message = Message::create([
                'conversation_id' => $bookingThread->conversation_id,
                'booking_id' => $booking->id,
                'sender_id' => $request->user()->id,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => $validated['content'],
            ]);

            $conversation = Conversation::find($bookingThread->conversation_id);
            $conversation->update(['last_message_at' => now()]);

            $message->load('sender');

            broadcast(new \App\Events\MessageSent($message))->toOthers();

            return response()->json($message, 201);
        });

    });

});
