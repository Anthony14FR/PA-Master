<?php

namespace App\Events;

use App\Models\Booking;
use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Booking $booking;

    public Message $systemMessage;

    public function __construct(Booking $booking, Message $systemMessage)
    {
        $this->booking = $booking;
        $this->systemMessage = $systemMessage;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('conversation.'.$this->systemMessage->conversation_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'booking' => [
                'id' => $this->booking->id,
                'check_in_date' => $this->booking->check_in_date,
                'check_out_date' => $this->booking->check_out_date,
                'total_price' => $this->booking->total_price,
                'status' => $this->booking->status,
            ],
            'message' => [
                'id' => $this->systemMessage->id,
                'conversation_id' => $this->systemMessage->conversation_id,
                'booking_id' => $this->systemMessage->booking_id,
                'sender_type' => $this->systemMessage->sender_type,
                'message_type' => $this->systemMessage->message_type,
                'content' => $this->systemMessage->content,
                'created_at' => $this->systemMessage->created_at,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'booking.created';
    }
}
