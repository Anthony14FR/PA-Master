<?php

namespace Database\Seeders;

use App\Models\Conversation;
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
        // Récupérer les IDs des clients
        $client1Id = DB::table('users')->where('email', 'client1@orus.com')->value('id');
        $client2Id = DB::table('users')->where('email', 'client2@orus.com')->value('id');
        $client3Id = DB::table('users')->where('email', 'client3@orus.com')->value('id');
        $client4Id = DB::table('users')->where('email', 'client4@orus.com')->value('id');

        // Récupérer les IDs des managers
        $manager1Id = DB::table('users')->where('email', 'manager1@orus.com')->value('id');
        $manager2Id = DB::table('users')->where('email', 'manager2@orus.com')->value('id');
        $manager3Id = DB::table('users')->where('email', 'manager3@orus.com')->value('id');

        // Récupérer les établissements
        $establishments = DB::table('establishments')->limit(3)->get();
        $establishment1Id = $establishments[0]->id ?? null;
        $establishment2Id = $establishments[1]->id ?? null;
        $establishment3Id = $establishments[2]->id ?? null;

        if (! $client1Id || ! $establishment1Id) {
            throw new \RuntimeException('Required data missing. Ensure UsersSeeder and EstablishmentSeeder ran successfully.');
        }

        // === CONVERSATION 1: Client 1 (Marie Dupont) <-> Établissement 1 ===
        $conv1 = Conversation::firstOrCreate(
            [
                'user_id' => $client1Id,
                'establishment_id' => $establishment1Id,
            ],
            [
                'last_message_at' => Carbon::now()->subHours(1),
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subHours(1),
            ]
        );

        DB::table('messages')->insertOrIgnore([
            [
                'conversation_id' => $conv1->id,
                'booking_id' => null,
                'sender_id' => $client1Id,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => 'Bonjour, j\'aimerais savoir si vous acceptez les chiens de grande taille ?',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'conversation_id' => $conv1->id,
                'booking_id' => null,
                'sender_id' => $manager1Id,
                'sender_type' => 'establishment',
                'message_type' => 'text',
                'content' => 'Bonjour Marie ! Oui, nous acceptons les chiens de toutes tailles. Nous avons de l\'expérience avec les grandes races. De quelle race s\'agit-il ?',
                'created_at' => Carbon::now()->subDays(15)->addHours(2),
                'updated_at' => Carbon::now()->subDays(15)->addHours(2),
            ],
            [
                'conversation_id' => $conv1->id,
                'booking_id' => null,
                'sender_id' => $client1Id,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => 'C\'est un Golden Retriever de 3 ans, très sociable !',
                'created_at' => Carbon::now()->subDays(14),
                'updated_at' => Carbon::now()->subDays(14),
            ],
            [
                'conversation_id' => $conv1->id,
                'booking_id' => null,
                'sender_id' => $manager1Id,
                'sender_type' => 'establishment',
                'message_type' => 'text',
                'content' => 'Parfait ! Les Golden sont adorables. N\'hésitez pas à réserver, nous avons de la place.',
                'created_at' => Carbon::now()->subDays(14)->addHours(1),
                'updated_at' => Carbon::now()->subDays(14)->addHours(1),
            ],
            [
                'conversation_id' => $conv1->id,
                'booking_id' => null,
                'sender_id' => $client1Id,
                'sender_type' => 'user',
                'message_type' => 'text',
                'content' => 'Super ! Je vais faire une réservation. Merci beaucoup !',
                'created_at' => Carbon::now()->subHours(1),
                'updated_at' => Carbon::now()->subHours(1),
            ],
        ]);

        // === CONVERSATION 2: Client 2 (Jean Moreau) <-> Établissement 1 ===
        if ($client2Id && $establishment1Id) {
            $conv2 = Conversation::firstOrCreate(
                [
                    'user_id' => $client2Id,
                    'establishment_id' => $establishment1Id,
                ],
                [
                    'last_message_at' => Carbon::now()->subDays(2),
                    'created_at' => Carbon::now()->subDays(7),
                    'updated_at' => Carbon::now()->subDays(2),
                ]
            );

            DB::table('messages')->insertOrIgnore([
                [
                    'conversation_id' => $conv2->id,
                    'booking_id' => null,
                    'sender_id' => $client2Id,
                    'sender_type' => 'user',
                    'message_type' => 'text',
                    'content' => 'Bonjour, acceptez-vous les chats ?',
                    'created_at' => Carbon::now()->subDays(7),
                    'updated_at' => Carbon::now()->subDays(7),
                ],
                [
                    'conversation_id' => $conv2->id,
                    'booking_id' => null,
                    'sender_id' => $manager1Id,
                    'sender_type' => 'establishment',
                    'message_type' => 'text',
                    'content' => 'Bonjour Jean ! Oui, nous avons un espace dédié aux chats avec tout le confort nécessaire.',
                    'created_at' => Carbon::now()->subDays(7)->addHours(3),
                    'updated_at' => Carbon::now()->subDays(7)->addHours(3),
                ],
                [
                    'conversation_id' => $conv2->id,
                    'booking_id' => null,
                    'sender_id' => $client2Id,
                    'sender_type' => 'user',
                    'message_type' => 'text',
                    'content' => 'Parfait ! Mon chat est assez timide, est-ce qu\'il aura un espace tranquille ?',
                    'created_at' => Carbon::now()->subDays(6),
                    'updated_at' => Carbon::now()->subDays(6),
                ],
                [
                    'conversation_id' => $conv2->id,
                    'booking_id' => null,
                    'sender_id' => $manager1Id,
                    'sender_type' => 'establishment',
                    'message_type' => 'text',
                    'content' => 'Absolument ! Chaque chat a son propre box avec des cachettes. Pas de stress pour votre petit félin.',
                    'created_at' => Carbon::now()->subDays(2),
                    'updated_at' => Carbon::now()->subDays(2),
                ],
            ]);
        }

        // === CONVERSATION 3: Client 3 (Isabelle Laurent) <-> Établissement 2 ===
        if ($client3Id && $establishment2Id && $manager2Id) {
            $conv3 = Conversation::firstOrCreate(
                [
                    'user_id' => $client3Id,
                    'establishment_id' => $establishment2Id,
                ],
                [
                    'last_message_at' => Carbon::now()->subDays(5),
                    'created_at' => Carbon::now()->subDays(10),
                    'updated_at' => Carbon::now()->subDays(5),
                ]
            );

            DB::table('messages')->insertOrIgnore([
                [
                    'conversation_id' => $conv3->id,
                    'booking_id' => null,
                    'sender_id' => $client3Id,
                    'sender_type' => 'user',
                    'message_type' => 'text',
                    'content' => 'Bonjour, acceptez-vous les lapins ?',
                    'created_at' => Carbon::now()->subDays(10),
                    'updated_at' => Carbon::now()->subDays(10),
                ],
                [
                    'conversation_id' => $conv3->id,
                    'booking_id' => null,
                    'sender_id' => $manager2Id,
                    'sender_type' => 'establishment',
                    'message_type' => 'text',
                    'content' => 'Bonjour Isabelle ! Oui, nous avons l\'habitude des lapins. Ils ont un enclos spacieux.',
                    'created_at' => Carbon::now()->subDays(10)->addHours(4),
                    'updated_at' => Carbon::now()->subDays(10)->addHours(4),
                ],
                [
                    'conversation_id' => $conv3->id,
                    'booking_id' => null,
                    'sender_id' => $client3Id,
                    'sender_type' => 'user',
                    'message_type' => 'text',
                    'content' => 'Super ! Merci pour l\'information.',
                    'created_at' => Carbon::now()->subDays(5),
                    'updated_at' => Carbon::now()->subDays(5),
                ],
            ]);
        }

        // === CONVERSATION 4: Client 4 (Lucas Petit) <-> Établissement 2 ===
        if ($client4Id && $establishment2Id && $manager2Id) {
            $conv4 = Conversation::firstOrCreate(
                [
                    'user_id' => $client4Id,
                    'establishment_id' => $establishment2Id,
                ],
                [
                    'last_message_at' => Carbon::now()->subHours(3),
                    'created_at' => Carbon::now()->subDays(3),
                    'updated_at' => Carbon::now()->subHours(3),
                ]
            );

            DB::table('messages')->insertOrIgnore([
                [
                    'conversation_id' => $conv4->id,
                    'booking_id' => null,
                    'sender_id' => $client4Id,
                    'sender_type' => 'user',
                    'message_type' => 'text',
                    'content' => 'Bonjour, j\'ai un Husky très énergique, pouvez-vous le gérer ?',
                    'created_at' => Carbon::now()->subDays(3),
                    'updated_at' => Carbon::now()->subDays(3),
                ],
                [
                    'conversation_id' => $conv4->id,
                    'booking_id' => null,
                    'sender_id' => $manager2Id,
                    'sender_type' => 'establishment',
                    'message_type' => 'text',
                    'content' => 'Bonjour Lucas ! Bien sûr ! Nous avons un grand parc et faisons plusieurs sorties par jour. Les Huskies adorent !',
                    'created_at' => Carbon::now()->subDays(3)->addHours(1),
                    'updated_at' => Carbon::now()->subDays(3)->addHours(1),
                ],
                [
                    'conversation_id' => $conv4->id,
                    'booking_id' => null,
                    'sender_id' => $client4Id,
                    'sender_type' => 'user',
                    'message_type' => 'text',
                    'content' => 'Génial ! Il a besoin de beaucoup d\'exercice, c\'est parfait.',
                    'created_at' => Carbon::now()->subHours(3),
                    'updated_at' => Carbon::now()->subHours(3),
                ],
            ]);
        }

        // === CONVERSATION 5: Client 1 (Marie Dupont) <-> Établissement 3 ===
        if ($client1Id && $establishment3Id && $manager3Id) {
            $conv5 = Conversation::firstOrCreate(
                [
                    'user_id' => $client1Id,
                    'establishment_id' => $establishment3Id,
                ],
                [
                    'last_message_at' => Carbon::now()->subDays(8),
                    'created_at' => Carbon::now()->subDays(20),
                    'updated_at' => Carbon::now()->subDays(8),
                ]
            );

            DB::table('messages')->insertOrIgnore([
                [
                    'conversation_id' => $conv5->id,
                    'booking_id' => null,
                    'sender_id' => $client1Id,
                    'sender_type' => 'user',
                    'message_type' => 'text',
                    'content' => 'Bonjour, avez-vous des disponibilités en août ?',
                    'created_at' => Carbon::now()->subDays(20),
                    'updated_at' => Carbon::now()->subDays(20),
                ],
                [
                    'conversation_id' => $conv5->id,
                    'booking_id' => null,
                    'sender_id' => $manager3Id,
                    'sender_type' => 'establishment',
                    'message_type' => 'text',
                    'content' => 'Bonjour Marie ! Malheureusement nous sommes complets pour août. Désolée !',
                    'created_at' => Carbon::now()->subDays(20)->addHours(5),
                    'updated_at' => Carbon::now()->subDays(20)->addHours(5),
                ],
                [
                    'conversation_id' => $conv5->id,
                    'booking_id' => null,
                    'sender_id' => $client1Id,
                    'sender_type' => 'user',
                    'message_type' => 'text',
                    'content' => 'Pas de problème, merci de votre réponse !',
                    'created_at' => Carbon::now()->subDays(8),
                    'updated_at' => Carbon::now()->subDays(8),
                ],
            ]);
        }
    }
}
