<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get IDs
        $userId = DB::table('users')->where('email', 'user@orus.com')->value('id');
        $establishmentId = DB::table('establishments')->first()->id;

        // Get pet IDs
        $rexId = DB::table('pets')->where('name', 'Rex')->value('id');
        $minouId = DB::table('pets')->where('name', 'Minou')->value('id');
        $kiwiId = DB::table('pets')->where('name', 'Kiwi')->value('id');
        $maxId = DB::table('pets')->where('name', 'Max')->value('id');

        // Get animal type IDs
        $dogTypeId = DB::table('animal_types')->where('code', 'dog')->value('id');
        $catTypeId = DB::table('animal_types')->where('code', 'cat')->value('id');
        $birdTypeId = DB::table('animal_types')->where('code', 'bird')->value('id');

        // Create services for the establishment (specific to animal types)
        $walkServiceId = DB::table('services')->insertGetId([
            'establishment_id' => $establishmentId,
            'animal_type_id' => $dogTypeId,
            'name' => 'Promenade quotidienne',
            'description' => 'Promenade d\'une heure dans le parc',
            'is_included' => false,
            'price' => 15.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $groomingServiceId = DB::table('services')->insertGetId([
            'establishment_id' => $establishmentId,
            'animal_type_id' => $dogTypeId,
            'name' => 'Toilettage',
            'description' => 'Bain, séchage et brossage complet',
            'is_included' => false,
            'price' => 45.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $medicationServiceId = DB::table('services')->insertGetId([
            'establishment_id' => $establishmentId,
            'animal_type_id' => $dogTypeId,
            'name' => 'Administration médicaments',
            'description' => 'Prise en charge de l\'administration des médicaments',
            'is_included' => true,
            'price' => 0.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $photoServiceId = DB::table('services')->insertGetId([
            'establishment_id' => $establishmentId,
            'animal_type_id' => $dogTypeId,
            'name' => 'Photos quotidiennes',
            'description' => 'Envoi de photos quotidiennes de votre animal',
            'is_included' => true,
            'price' => 0.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === BOOKING 1: Completed - Rex only ===
        $booking1Id = DB::table('bookings')->insertGetId([
            'user_id' => $userId,
            'establishment_id' => $establishmentId,
            'check_in_date' => Carbon::now()->subDays(20)->format('Y-m-d'),
            'check_out_date' => Carbon::now()->subDays(15)->format('Y-m-d'),
            'total_price' => 225.00, // 5 nights * 30€ + 3 walks * 15€
            'status' => 'completed',
            'special_requests' => 'Rex adore jouer avec la balle. Merci de bien surveiller ses pauses pipi toutes les 4h.',
            'created_at' => Carbon::now()->subDays(25),
            'updated_at' => Carbon::now()->subDays(15),
        ]);

        DB::table('booking_pets')->insert([
            'booking_id' => $booking1Id,
            'pet_id' => $rexId,
            'price_per_night' => 30.00,
            'number_of_nights' => 5,
            'subtotal' => 150.00,
            'created_at' => Carbon::now()->subDays(25),
            'updated_at' => Carbon::now()->subDays(25),
        ]);

        DB::table('booking_services')->insert([
            'booking_id' => $booking1Id,
            'service_id' => $walkServiceId,
            'quantity' => 5,
            'unit_price' => 15.00,
            'subtotal' => 75.00,
            'created_at' => Carbon::now()->subDays(25),
            'updated_at' => Carbon::now()->subDays(25),
        ]);

        // === BOOKING 2: Confirmed - Rex + Minou ===
        $booking2Id = DB::table('bookings')->insertGetId([
            'user_id' => $userId,
            'establishment_id' => $establishmentId,
            'check_in_date' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'check_out_date' => Carbon::now()->addDays(12)->format('Y-m-d'),
            'total_price' => 445.00, // (7 nights * 30€ Rex) + (7 nights * 25€ Minou) + (7 walks * 15€) + toilettage
            'status' => 'confirmed',
            'special_requests' => 'Rex et Minou peuvent cohabiter, mais Minou préfère rester à distance. Merci de prévoir des espaces séparés pour manger.',
            'created_at' => Carbon::now()->subDays(3),
            'updated_at' => Carbon::now()->subDays(3),
        ]);

        DB::table('booking_pets')->insert([
            [
                'booking_id' => $booking2Id,
                'pet_id' => $rexId,
                'price_per_night' => 30.00,
                'number_of_nights' => 7,
                'subtotal' => 210.00,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'booking_id' => $booking2Id,
                'pet_id' => $minouId,
                'price_per_night' => 25.00,
                'number_of_nights' => 7,
                'subtotal' => 175.00,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
        ]);

        DB::table('booking_services')->insert([
            [
                'booking_id' => $booking2Id,
                'service_id' => $walkServiceId,
                'quantity' => 7,
                'unit_price' => 15.00,
                'subtotal' => 105.00,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'booking_id' => $booking2Id,
                'service_id' => $groomingServiceId,
                'quantity' => 1,
                'unit_price' => 45.00,
                'subtotal' => 45.00,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
        ]);

        // === BOOKING 3: Confirmed - Max with medications ===
        $booking3Id = DB::table('bookings')->insertGetId([
            'user_id' => $userId,
            'establishment_id' => $establishmentId,
            'check_in_date' => Carbon::now()->addDays(10)->format('Y-m-d'),
            'check_out_date' => Carbon::now()->addDays(17)->format('Y-m-d'),
            'total_price' => 240.00, // 8 nights * 30€
            'status' => 'confirmed',
            'special_requests' => 'Max a de l\'arthrose et prend des médicaments matin et soir. Merci de respecter strictement les horaires. Il ne peut pas faire de longues promenades.',
            'created_at' => Carbon::now()->subDays(5),
            'updated_at' => Carbon::now()->subDays(5),
        ]);

        DB::table('booking_pets')->insert([
            'booking_id' => $booking3Id,
            'pet_id' => $maxId,
            'price_per_night' => 30.00,
            'number_of_nights' => 8,
            'subtotal' => 240.00,
            'created_at' => Carbon::now()->subDays(5),
            'updated_at' => Carbon::now()->subDays(5),
        ]);

        DB::table('booking_services')->insert([
            'booking_id' => $booking3Id,
            'service_id' => $medicationServiceId,
            'quantity' => 8,
            'unit_price' => 0.00,
            'subtotal' => 0.00,
            'created_at' => Carbon::now()->subDays(5),
            'updated_at' => Carbon::now()->subDays(5),
        ]);

        // === BOOKING 4: Pending - Kiwi (bird) ===
        $booking4Id = DB::table('bookings')->insertGetId([
            'user_id' => $userId,
            'establishment_id' => $establishmentId,
            'check_in_date' => Carbon::now()->addDays(30)->format('Y-m-d'),
            'check_out_date' => Carbon::now()->addDays(35)->format('Y-m-d'),
            'total_price' => 100.00, // 5 nights * 20€ (bird pricing)
            'status' => 'pending',
            'special_requests' => 'Kiwi a besoin d\'une cage spacieuse et de lumière naturelle. Il aime chanter le matin !',
            'created_at' => Carbon::now()->subDays(1),
            'updated_at' => Carbon::now()->subDays(1),
        ]);

        DB::table('booking_pets')->insert([
            'booking_id' => $booking4Id,
            'pet_id' => $kiwiId,
            'price_per_night' => 20.00,
            'number_of_nights' => 5,
            'subtotal' => 100.00,
            'created_at' => Carbon::now()->subDays(1),
            'updated_at' => Carbon::now()->subDays(1),
        ]);

        // === BOOKING 5: Cancelled - Rex ===
        $booking5Id = DB::table('bookings')->insertGetId([
            'user_id' => $userId,
            'establishment_id' => $establishmentId,
            'check_in_date' => Carbon::now()->addDays(15)->format('Y-m-d'),
            'check_out_date' => Carbon::now()->addDays(18)->format('Y-m-d'),
            'total_price' => 90.00,
            'status' => 'cancelled',
            'special_requests' => null,
            'created_at' => Carbon::now()->subDays(7),
            'updated_at' => Carbon::now()->subDays(2),
        ]);

        DB::table('booking_pets')->insert([
            'booking_id' => $booking5Id,
            'pet_id' => $rexId,
            'price_per_night' => 30.00,
            'number_of_nights' => 3,
            'subtotal' => 90.00,
            'created_at' => Carbon::now()->subDays(7),
            'updated_at' => Carbon::now()->subDays(7),
        ]);
    }
}
