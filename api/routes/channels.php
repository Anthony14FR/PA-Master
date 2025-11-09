<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Route::post('/auth', function () {
    return Broadcast::auth(request());
})->middleware(['auth.jwt']);

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::with('establishment.collaborators')->find($conversationId);

    if (! $conversation) {
        return false;
    }

    return $conversation->user_id === $user->id ||
           $conversation->establishment->manager_id === $user->id ||
           $conversation->establishment->collaborators->contains('id', $user->id);
});
