<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get IDs
        $userId = DB::table('users')->where('email', 'user@orus.com')->value('id');
        $managerId = DB::table('users')->where('email', 'manager@orus.com')->value('id');
        $establishments = DB::table('establishments')->limit(2)->get();

        $establishment1Id = $establishments[0]->id ?? null;
        $establishment2Id = $establishments[1]->id ?? null;

        // Get booking IDs
        $bookings = DB::table('bookings')->get();
        $booking1Id = $bookings[0]->id ?? null; // Completed
        $booking2Id = $bookings[1]->id ?? null; // Confirmed

        if (! $establishment1Id || ! $userId) {
            return; // Skip if no data
        }

        // === CONVERSATION 1: With bookings and threads ===
        $conversation1Id = DB::table('conversations')->insertGetId([
            'user_id' => $userId,
            'establishment_id' => $establishment1Id,
            'last_message_at' => Carbon::now()->subHours(2),
            'created_at' => Carbon::now()->subDays(30),
            'updated_at' => Carbon::now()->subHours(2),
        ]);

        // Initial contact message
        $message1Id = DB::table('messages')->insertGetId([
            'conversation_id' => $conversation1Id,
            'booking_id' => null,
            'sender_id' => $userId,
            'sender_type' => 'user',
            'message_type' => 'text',
            'content' => 'Bonjour, j\'aimerais savoir si vous acceptez les chiens de grande taille ?',
            'created_at' => Carbon::now()->subDays(30),
            'updated_at' => Carbon::now()->subDays(30),
        ]);

        $message2Id = DB::table('messages')->insertGetId([
            'conversation_id' => $conversation1Id,
            'booking_id' => null,
            'sender_id' => $managerId,
            'sender_type' => 'establishment',
            'message_type' => 'text',
            'content' => 'Bonjour ! Oui, nous acceptons les chiens de toutes tailles. Nous avons de l\'expérience avec les grandes races. N\'hésitez pas à me parler de votre chien !',
            'created_at' => Carbon::now()->subDays(30)->addHours(1),
            'updated_at' => Carbon::now()->subDays(30)->addHours(1),
        ]);

        // Booking reference message (booking 1)
        if ($booking1Id) {
            $message3Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking1Id,
                'sender_id' => null,
                'sender_type' => 'system',
                'message_type' => 'booking_reference',
                'content' => 'Réservation confirmée pour Rex',
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(25),
            ]);

            // Create booking thread
            $thread1Id = DB::table('booking_threads')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking1Id,
                'is_active' => false, // Completed booking, archived
                'archived_at' => Carbon::now()->subDays(14),
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(14),
            ]);

            // Messages in booking thread
            $message4Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking1Id,
                'sender_id' => null,
                'sender_type' => 'system',
                'message_type' => 'system',
                'content' => 'Thread de réservation créé - Check-in: '.Carbon::now()->subDays(20)->format('d/m/Y').', Check-out: '.Carbon::now()->subDays(15)->format('d/m/Y'),
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(25),
            ]);

            $message5Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking1Id,
                'sender_id' => $userId,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => 'Bonjour, je vous envoie le carnet de vaccination de Rex.',
                'created_at' => Carbon::now()->subDays(22),
                'updated_at' => Carbon::now()->subDays(22),
            ]);

            // File attached to message
            DB::table('message_files')->insert([
                'message_id' => $message5Id,
                'file_name' => 'carnet_vaccination_rex.pdf',
                'file_path' => 'messages/files/carnet_vaccination_rex.pdf',
                'file_type' => 'document',
                'file_size' => 524288, // 512 KB
                'mime_type' => 'application/pdf',
                'created_at' => Carbon::now()->subDays(22),
            ]);

            $message6Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking1Id,
                'sender_id' => $managerId,
                'sender_type' => 'establishment',
                'message_type' => 'text',
                'content' => 'Parfait, tout est en ordre ! Rex sera entre de bonnes mains.',
                'created_at' => Carbon::now()->subDays(22)->addHours(2),
                'updated_at' => Carbon::now()->subDays(22)->addHours(2),
            ]);

            // During stay - photo message
            $message7Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking1Id,
                'sender_id' => $managerId,
                'sender_type' => 'establishment',
                'message_type' => 'file',
                'content' => 'Rex s\'amuse bien au parc !',
                'created_at' => Carbon::now()->subDays(18),
                'updated_at' => Carbon::now()->subDays(18),
            ]);

            DB::table('message_files')->insert([
                'message_id' => $message7Id,
                'file_name' => 'rex_parc.jpg',
                'file_path' => 'messages/photos/rex_parc.jpg',
                'file_type' => 'image',
                'file_size' => 2097152, // 2 MB
                'mime_type' => 'image/jpeg',
                'created_at' => Carbon::now()->subDays(18),
            ]);

            $message8Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking1Id,
                'sender_id' => $userId,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => 'Merci beaucoup ! Il a l\'air très heureux !',
                'created_at' => Carbon::now()->subDays(18)->addHours(1),
                'updated_at' => Carbon::now()->subDays(18)->addHours(1),
            ]);
        }

        // Booking reference message (booking 2)
        if ($booking2Id) {
            $message9Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking2Id,
                'sender_id' => null,
                'sender_type' => 'system',
                'message_type' => 'booking_reference',
                'content' => 'Réservation confirmée pour Rex et Minou',
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ]);

            // Create active booking thread
            $thread2Id = DB::table('booking_threads')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking2Id,
                'is_active' => true,
                'archived_at' => null,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ]);

            // Messages in active booking thread
            $message10Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking2Id,
                'sender_id' => null,
                'sender_type' => 'system',
                'message_type' => 'system',
                'content' => 'Thread de réservation créé - Check-in: '.Carbon::now()->addDays(5)->format('d/m/Y').', Check-out: '.Carbon::now()->addDays(12)->format('d/m/Y'),
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ]);

            $message11Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking2Id,
                'sender_id' => $userId,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => 'Bonjour ! Petite précision : Minou n\'aime pas trop les autres chats. Est-ce que cela pose problème ?',
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ]);

            $message12Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation1Id,
                'booking_id' => $booking2Id,
                'sender_id' => $managerId,
                'sender_type' => 'establishment',
                'message_type' => 'text',
                'content' => 'Pas de souci ! Nous avons des espaces séparés et nous gérons cela régulièrement. Minou aura son propre espace tranquille.',
                'created_at' => Carbon::now()->subHours(2),
                'updated_at' => Carbon::now()->subHours(2),
            ]);
        }

        // General conversation message (outside threads)
        $message13Id = DB::table('messages')->insertGetId([
            'conversation_id' => $conversation1Id,
            'booking_id' => null,
            'sender_id' => $userId,
            'sender_type' => 'user',
            'message_type' => 'text',
            'content' => 'Super ! J\'ai hâte. Merci pour votre professionnalisme.',
            'created_at' => Carbon::now()->subHours(1),
            'updated_at' => Carbon::now()->subHours(1),
        ]);

        // === CONVERSATION 2: Simple conversation without bookings ===
        if ($establishment2Id) {
            $conversation2Id = DB::table('conversations')->insertGetId([
                'user_id' => $userId,
                'establishment_id' => $establishment2Id,
                'last_message_at' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(5),
            ]);

            $message14Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation2Id,
                'booking_id' => null,
                'sender_id' => $userId,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => 'Bonjour, acceptez-vous les oiseaux ? J\'ai une perruche.',
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ]);

            $message15Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation2Id,
                'booking_id' => null,
                'sender_id' => $managerId,
                'sender_type' => 'establishment',
                'message_type' => 'text',
                'content' => 'Bonjour ! Malheureusement, nous ne sommes pas équipés pour les oiseaux pour le moment. Désolé !',
                'created_at' => Carbon::now()->subDays(10)->addHours(3),
                'updated_at' => Carbon::now()->subDays(10)->addHours(3),
            ]);

            $message16Id = DB::table('messages')->insertGetId([
                'conversation_id' => $conversation2Id,
                'booking_id' => null,
                'sender_id' => $userId,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => 'Pas de problème, merci de votre réponse !',
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ]);
        }

        // Mark some messages as read
        if (isset($message1Id, $message2Id, $message3Id)) {
            DB::table('message_reads')->insert([
                [
                    'message_id' => $message1Id,
                    'user_id' => $managerId,
                    'read_at' => Carbon::now()->subDays(30)->addMinutes(30),
                ],
                [
                    'message_id' => $message2Id,
                    'user_id' => $userId,
                    'read_at' => Carbon::now()->subDays(30)->addHours(2),
                ],
            ]);
        }
    }
}
